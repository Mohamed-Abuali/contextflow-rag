from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database.database_functions import create_chat, insert_message
from app.services.packing_service import get_chat_id
from app.services.ama_service import get_ama_response

router = APIRouter()

class NewMessageRequest(BaseModel):
    message: str
    chat_id: int | None = None

@router.post("/api/chat/message")
async def post_message(request: NewMessageRequest):
    chat_id = request.chat_id
    if not chat_id:
        # This is a new chat, so get a new chat ID from the packing service
        # In a real application, you might pass more context to the packing service
        chat_id = create_chat()

    # Store the user's message
    user_message = insert_message(chat_id, 'user', request.message)
    if not user_message:
        raise HTTPException(status_code=500, detail="Failed to store user message")

    # Get a response from the Ama model
    ama_response_content = get_ama_response(request.message)

    # Store the Ama model's response
    ama_response = insert_message(chat_id, 'ama', ama_response_content)
    if not ama_response:
        raise HTTPException(status_code=500, detail="Failed to store Ama model response")

    return {
        "user_message": user_message,
        "ama_response": ama_response
    }
