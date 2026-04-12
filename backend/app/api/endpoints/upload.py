from fastapi import APIRouter,HTTPException,File, UploadFile, Form
from app.tools.parsefile import extract_text_from_pdf
from store_vector import create_vector_store
from langchain_core.documents.base import Blob


router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
):
    try:
        if file.filename and file.filename.split(".")[-1] not in ["pdf","docx","txt"]:
            raise HTTPException(status_code=400,detail="Invalid document type")
        file_content = await file.read()
        blob = Blob(data=file_content)
        documents = extract_text_from_pdf(blob)
        if documents:
            create_vector_store(documents)
            return {"message": "File uploaded and processed successfully"}
        else:
            raise HTTPException(status_code=400, detail="No valid text content extracted from the file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


     
   
