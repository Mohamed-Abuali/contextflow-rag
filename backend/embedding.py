from langchain_ollama import OllamaEmbeddings
from settings import Settings




def get_embeddings() -> OllamaEmbeddings:
    return OllamaEmbeddings(
        model=Settings.embedding_model,
        dimensions=1536,
        )
