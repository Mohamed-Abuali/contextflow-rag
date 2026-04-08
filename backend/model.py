from langchain_ollama import OllamaLLM
from .settings import Settings


def init_model() -> OllamaLLM:
    return OllamaLLM(
        model=Settings.model,
        temperature=0.7,
        top_p=0.9,
        streaming=False,
        max_tokens=1024,
        )
