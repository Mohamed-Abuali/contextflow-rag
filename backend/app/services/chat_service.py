"""Chat service for handling chat-related operations."""
from sqlalchemy.orm import Session
from app.database.models import Message, Chat
from fastapi import HTTPException, status

class ChatService:
    """Service for chat operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_chat_history(self, conversation_id: int, user_id: int, limit: int, offset: int) -> list[Message]:
        """Get chat history for a conversation."""
        # Verify that the user has access to this conversation
        chat = self.db.query(Chat).filter(Chat.id == conversation_id, Chat.user_id == user_id).first()
        
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or you do not have permission to access it."
            )
        
        # Get messages for the conversation
        messages = (
            self.db.query(Message)
            .filter(Message.chat_id == conversation_id)
            .order_by(Message.created_at.asc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        
        return messages