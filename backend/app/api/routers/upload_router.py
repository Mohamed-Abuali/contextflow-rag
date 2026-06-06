"""Upload router for ingesting documents into the persistent vector store."""
import logging
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from langchain_core.documents.base import Blob

from app.api.dependencies import get_current_user
from app.database.models import User
from app.services.vector_store import add_documents
from app.tools.parsefile import extract_text_from_pdf

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Persist an uploaded document's contents in the vector store."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Filename is required."
        )
    extension = file.filename.rsplit(".", 1)[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported document type: {extension}",
        )

    file_content = await file.read()
    blob = Blob(data=file_content)
    try:
        documents = extract_text_from_pdf(blob)
    except Exception as exc:
        logger.exception("Failed to parse uploaded document")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse document: {exc}",
        )

    if not documents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid text content extracted from the file.",
        )

    chunks_added = add_documents(documents)
    return {
        "message": "File uploaded and processed successfully.",
        "filename": file.filename,
        "chunks": chunks_added,
        "user_id": current_user.id,
    }
