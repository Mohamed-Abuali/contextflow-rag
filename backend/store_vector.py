import os
from langchain_chroma import Chroma
from embedding import get_embeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
vector_store_path = os.path.join(os.path.dirname(__file__),"app/data/vector_store")

def get_vector_store() -> Chroma | None:
    if not os.path.exists(vector_store_path):
        os.makedirs(vector_store_path)
    return Chroma(
        persist_directory=vector_store_path,
        embedding_function=get_embeddings(),
    )

def create_vector_store(document,chunk_size:int=500,chunk_overlap:int=50):
    

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = splitter.split_documents(document)
    return Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        persist_directory=vector_store_path,
    )
