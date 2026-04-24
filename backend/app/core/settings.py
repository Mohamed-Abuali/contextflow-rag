
from dotenv import load_dotenv
import os
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

load_dotenv()

class Settings():
    model: str = os.getenv("MODEL")
    embedding_model: str = os.getenv("EMBEDDING_MODEL")
    memory_key: str = "chat_history"
    input_key: str = "input"
    output_key: str = "answer"


#Chat
class ResponseModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    timestamp: int = Field(default_factory=lambda: int(datetime.utcnow().timestamp()))
    session_id:str
    context_source:list[str] = []
class MessageForm(BaseModel):
    sender: str = Field(default="user")
    ai: str = Field(default="AI")