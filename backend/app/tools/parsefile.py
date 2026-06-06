"""PDF/document parsing helpers with lazy LangChain imports."""
from typing import Any


def extract_text_from_pdf(blob: Any):
    """Parse a PDF blob into LangChain documents.

    The LangChain community parser is imported lazily so the module loads even
    when `langchain-community` is not installed; the import error is only
    surfaced when an upload is actually attempted.
    """
    try:
        from langchain_community.document_loaders.parsers import PyPDFParser
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "langchain-community is required to parse uploaded documents. "
            "Install it with `pip install langchain-community pypdf`."
        ) from exc

    parser = PyPDFParser()
    return parser.parse(blob)
