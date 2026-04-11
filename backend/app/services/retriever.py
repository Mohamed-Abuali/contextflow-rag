from store_vector import get_vector_store

def get_retriever() -> Chroma | None:
    vector_store = get_vector_store()
    if not vector_store:
        raise RuntimeError("Vector store not found")
    return vector_store.as_retriever(search_kwargs={"k": 3})