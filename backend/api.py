import logging

from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from chain import build_chat_chain
from settings import Settings
from langchain_core.output_parsers import StrOutputParser

router = APIRouter()

logger = logging.getLogger(__name__)
chat_chain = build_chat_chain()
parser = StrOutputParser()
class RequestModel(BaseModel):
    message:str
    session_id:str = "default_session"

class ResponseModel(BaseModel):
    response:str
    session_id:str


@router.post("/chat",response_model=ResponseModel)
async def chat_endpoint(request:RequestModel):
    try:
        response = chat_chain.invoke(
            {Settings.input_key:request.message},
            config={f"configurable":{"session_id":request.session_id}}
        )
        result = parser.invoke(response)
        return ResponseModel(response=result,session_id=request.session_id)
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500,detail="Internal server error")


@router.get('/health',response_model=dict)
def health_check():
    return {"status":"healthy"}