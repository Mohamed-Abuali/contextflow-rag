from langchain_ollama import OllamaLLM
from settings import Settings


def init_model() -> OllamaLLM:
    return OllamaLLM(
        model=Settings.model,
        temperature=0.7,
        num_predict=1024,
        )
