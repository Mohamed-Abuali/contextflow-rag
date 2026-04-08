import logging
from venv import logger
from fastapi import RouterAPI,HTTPException
from pydantic import BaseModel
from .chain import build_chat_chain

router = RouterAPI()

logger = logging.getLogger(__name__)
chat_chain = build_chat_chain()

class RequestModel(BaseModel):
    message:str
    session_id:str = "default_session"

class ResponseModel(BaseModel):
    response:str
    session_id:str


router.post("/chat",response_model=ResponseModel)
async def chat_endpoint(request:RequestModel):
    try:
        response = chat_chain.invoke(
            {Settings.input_key:request.message},
            config={f"configurable":{"session_id":request.session_id}}
        )
        return ResponseModel(response=response.content,session_id=response.session_id)
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500,detail="Internal server error")