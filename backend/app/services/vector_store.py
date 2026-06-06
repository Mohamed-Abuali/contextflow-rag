"""Persistent ChromaDB vector store helpers."""
from __future__ import annotations

import os
from typing import Any, List, Optional

from app.core.config import get_settings

_settings = get_settings()
_vector_store: Optional[Any] = None


def _get_chroma_cls():
    """Lazy import of Chroma so the app boots without langchain-chroma installed."""
    try:
        from langchain_chroma import Chroma
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "langchain-chroma is required for the persistent vector store. "
            "Install it with `pip install langchain-chroma`."
        ) from exc
    return Chroma


def _get_text_splitter(chunk_size: int, chunk_overlap: int):
    """Lazy import of the text splitter."""
    try:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "langchain-text-splitters is required to ingest documents. "
            "Install it with `pip install langchain-text-splitters`."
        ) from exc
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        is_separator_regex=False,
    )


def _get_embeddings():
    """Lazy-import embeddings so missing optional deps don't break startup."""
    try:
        from langchain_ollama import OllamaEmbeddings
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "langchain-ollama is required for vector embeddings."
        ) from exc
    return OllamaEmbeddings(model="nomic-embed-text")


def init_vector_store():
    """Initialise (or reload) the persistent Chroma vector store."""
    global _vector_store
    Chroma = _get_chroma_cls()
    persist_directory = os.path.abspath(_settings.vector_store_path)
    os.makedirs(persist_directory, exist_ok=True)
    _vector_store = Chroma(
        collection_name="xaiautopost_documents",
        persist_directory=persist_directory,
        embedding_function=_get_embeddings(),
    )
    return _vector_store


def get_vector_store():
    """Return the cached vector store, initialising it on first access."""
    if _vector_store is None:
        return init_vector_store()
    return _vector_store


def add_documents(
    documents: List[Any],
    chunk_size: int = 500,
    chunk_overlap: int = 50,
) -> int:
    """Split and persist documents into the vector store."""
    if not documents:
        return 0
    splitter = _get_text_splitter(chunk_size, chunk_overlap)
    chunks = splitter.split_documents(documents)
    store = get_vector_store()
    store.add_documents(chunks)
    return len(chunks)
