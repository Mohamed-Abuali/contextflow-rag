import os
from langchain_chroma import Chroma
from backend.embedding import get_embeddings

vector_store_path = os.path.join(os.path.dirname(__file__),"/data/vector_store")

def get_vector_store() -> Chroma | None:
    if not os.path.exist(vector_store_path):
        return None
    return Chroma(
        persist_directory=vector_store_path,
        embedding_function=get_embeddings(),
    )

def create_vector_store(document,chunk_size:int=500,chunk_overlap:int=50):
    from langchain_text.splitters import RecursiveCharacterTextSplitter

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        is_separator_regex=False,
    )
    chunks - splitter.split_document(document)
    return chroma.from_document(
        document=chunks,
        embedding=get_embeddings(),
        persist_directory=vector_store_path,
    )
