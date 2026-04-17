from fastapi import APIRouter, Request, HTTPException
from app.database.database_functions import get_all_chats, get_chat_by_id, insert_chat, CHAT

router = APIRouter()

@router.get("/history")
async def get_chats():
    chats = get_all_chats()
    return {"chats": chats}

@router.get("/history/{chat_id}")
async def get_chat(chat_id: int):
    chat = get_chat_by_id(chat_id)
    if chat:
        return {"chat": chat}
    else:
        return {"error": "Chat not found"}

@router.post("/history", response_model=dict)
async def post_chat(chat: CHAT):
    new_chat = insert_chat(chat)
    if new_chat:
        return new_chat
    raise HTTPException(status_code=500, detail="Failed to create chat")

