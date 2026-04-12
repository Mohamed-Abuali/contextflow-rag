import logging
import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter,HTTPException,File, UploadFile, Form
from pydantic import BaseModel, Field
from app.services.chain import build_chat_chain
from app.core.settings import Settings
from langchain_core.output_parsers import StrOutputParser
from app.tools.parsefile import extract_text_from_pdf
from langchain_core.documents.base import Blob

router = APIRouter()

logger = logging.getLogger(__name__)
chat_chain = build_chat_chain()
parser = StrOutputParser()

class ResponseModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    timestamp: int = Field(default_factory=lambda: int(datetime.utcnow().timestamp()))
    session_id:str
    context_source:list[str] = []


@router.post("/chat",response_model=ResponseModel)
async def chat_endpoint(
    message: str = Form(...),
    session_id: str = Form("default_session"),
):
    try:
        input_message = message


        response = await chat_chain.ainvoke(
            {Settings.input_key: input_message},
            config={"configurable": {"session_id": session_id}},
        )
        source = [doc.metadata.get("source","unknown") for doc in response.get("context",[])]
        result = response.get("answer")
        return ResponseModel(content=result,session_id=session_id,context_source=source)
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500,detail="Internal server error")


@router.get('/health',response_model=dict)
def health_check():
    return {"status":"healthy"}