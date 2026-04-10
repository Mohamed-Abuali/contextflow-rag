import logging
import uuid
from datetime import datetime
from fastapi import APIRouter,HTTPException
from pydantic import BaseModel, Field
from app.services.chain import build_chat_chain
from app.core.settings import Settings
from langchain_core.output_parsers import StrOutputParser

router = APIRouter()

logger = logging.getLogger(__name__)
chat_chain = build_chat_chain()
parser = StrOutputParser()
class RequestModel(BaseModel):
    message:str
    session_id:str = "default_session"

class ResponseModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    timestamp: int = Field(default_factory=lambda: int(datetime.utcnow().timestamp()))
    session_id:str


@router.post("/chat",response_model=ResponseModel)
async def chat_endpoint(request:RequestModel):
    try:
        response = chat_chain.invoke(
            {Settings.input_key:request.message},
            config={f"configurable":{"session_id":request.session_id}}
        )
        result = parser.invoke(response)
        return ResponseModel(content=result,session_id=request.session_id)
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500,detail="Internal server error")


@router.get('/health',response_model=dict)
def health_check():
    return {"status":"healthy"}