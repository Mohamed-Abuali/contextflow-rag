from fastapi import APIRouter, Request, HTTPException
from app.database.database_functions import get_all_chats, get_chat_by_id, insert_chat, CHAT, delete_chat_by_id, update_chat_by_id

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
@router.delete("/history/{chat_id}")
async def delete_chat(chat_id: int):
    if delete_chat_by_id(chat_id):
        return {"message": "Chat deleted",status_code: 200}
    else:
        return {"error": "Chat not found"}
@router.put("/history/{chat_id}")
async def update_chat(chat_id: str, chat: CHAT):
    updated_chat = update_chat_by_id(int(chat_id), chat)
    if updated_chat:
        return {"message": "Chat updated", "chat": updated_chat,status_code: 200}
    else:
        return {"error": "Chat not found",status_code: 404}
