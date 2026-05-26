from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.chat_service import ChatService
from app.services.auth_service import AuthService, UserResponse
from typing import List

router = APIRouter()

@router.get("/{conversation_id}", response_model=List[dict], status_code=status.HTTP_200_OK)
def get_chat_history(
    conversation_id: int,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(AuthService(db=next(get_db())).get_current_user)
):
    """Get chat history for a conversation."""
    chat_service = ChatService(db)
    messages = chat_service.get_chat_history(conversation_id, current_user.id, limit, offset)
    return [{"id": msg.id, "role": msg.role, "content": msg.content, "created_at": msg.created_at} for msg in messages]