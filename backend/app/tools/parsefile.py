from langchain_core.documents.base import Blob
from langchain_community.document_loaders.parsers import PyPDFParser



def extract_text_from_pdf(blob:Blob):
    parser = PyPDFParser()
    documents = parser.parse(blob)
    return documents