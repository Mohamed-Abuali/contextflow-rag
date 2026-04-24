import logging

from typing import Optional
from app.database.database_functions import update_chat_by_id
from fastapi import APIRouter,HTTPException,File, UploadFile, Form

from app.services.chain import build_chat_chain
from app.core.settings import Settings
from langchain_core.output_parsers import StrOutputParser


from app.core.settings import ResponseModel,MessageForm

router = APIRouter()

logger = logging.getLogger(__name__)
chat_chain = build_chat_chain()
parser = StrOutputParser()



@router.post("/chat",response_model=ResponseModel)
async def chat_endpoint(
    message: str = Form(...),
    session_id: str = Form("default_session"),
    chat_id: int = Form(None)
):
    try:
        message_form = MessageForm()
        message_form.sender = message
        

        response = await chat_chain.ainvoke(
            {Settings.input_key: message_form.sender},
            config={"configurable": {"session_id": session_id}},
        )
        source = [doc.metadata.get("source","unknown") for doc in response.get("context",[])]
        result = response.get("answer")
        message_form.ai = result
        update_chat_by_id(chat_id,message_form)
        return ResponseModel(content=result,session_id=session_id,context_source=source)
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500,detail="Internal server error")


@router.get('/health',response_model=dict)
def health_check():
    return {"status":"healthy"}