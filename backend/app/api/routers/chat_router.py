"""Chat router for retrieving chat history and streaming completions."""
import asyncio
import json
import logging
from typing import AsyncGenerator, List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.database import get_db
from app.database.models import Chat, Message, User
from app.services.chat_service import ChatService

logger = logging.getLogger(__name__)
router = APIRouter()


class StreamChatRequest(BaseModel):
    message: str
    chat_id: int | None = None


@router.get("", response_model=List[dict], status_code=status.HTTP_200_OK)
def list_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all conversations owned by the current user."""
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.id.desc())
        .all()
    )
    return [
        {"id": chat.id, "title": chat.title, "user_id": chat.user_id}
        for chat in chats
    ]


@router.get("/{conversation_id}", response_model=List[dict], status_code=status.HTTP_200_OK)
def get_chat_history(
    conversation_id: int,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get chat history for a conversation."""
    chat_service = ChatService(db)
    messages = chat_service.get_chat_history(
        conversation_id, current_user.id, limit, offset
    )
    return [
        {
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at,
        }
        for msg in messages
    ]


@router.post("/stream")
async def stream_chat(
    payload: StreamChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Stream a chat response using Server-Sent Events.

    Yields incremental tokens as they are produced by the LLM. The endpoint
    persists both the user prompt and the assistant reply, and gracefully
    halts if the client disconnects mid-stream.
    """
    # Resolve / create the conversation owned by the current user.
    chat: Chat | None = None
    if payload.chat_id is not None:
        chat = (
            db.query(Chat)
            .filter(Chat.id == payload.chat_id, Chat.user_id == current_user.id)
            .first()
        )
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found.",
            )
    else:
        chat = Chat(user_id=current_user.id, title=payload.message[:60])
        db.add(chat)
        db.commit()
        db.refresh(chat)

    # Persist the user's message immediately.
    user_msg = Message(chat_id=chat.id, role="user", content=payload.message)
    db.add(user_msg)
    db.commit()

    async def token_iterator() -> AsyncGenerator[str, None]:
        """Yield tokens from the chat chain, falling back to a stub on failure."""
        try:
            from app.services.chain import build_chat_chain  # local import to avoid startup cost

            chain = build_chat_chain()
            async for chunk in chain.astream(
                {"input": payload.message},
                config={"configurable": {"session_id": str(chat.id)}},
            ):
                token = chunk.get("answer") if isinstance(chunk, dict) else str(chunk)
                if token:
                    yield token
        except Exception as exc:  # pragma: no cover - safe fallback
            logger.warning("LLM chain unavailable, using echo fallback: %s", exc)
            for word in payload.message.split():
                yield word + " "
                await asyncio.sleep(0.05)

    async def event_publisher() -> AsyncGenerator[bytes, None]:
        """Wrap tokens in SSE format and persist the final reply."""
        collected: list[str] = []
        try:
            yield f"event: start\ndata: {json.dumps({'chat_id': chat.id})}\n\n".encode()
            async for token in token_iterator():
                if await request.is_disconnected():
                    logger.info("Client disconnected from stream for chat %s", chat.id)
                    break
                collected.append(token)
                yield f"data: {json.dumps({'token': token})}\n\n".encode()
            yield b"event: end\ndata: {}\n\n"
        finally:
            full_reply = "".join(collected).strip()
            if full_reply:
                assistant_msg = Message(
                    chat_id=chat.id, role="assistant", content=full_reply
                )
                db.add(assistant_msg)
                db.commit()

    return StreamingResponse(
        event_publisher(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
