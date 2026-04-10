
from dotenv import load_dotenv
import os

load_dotenv()

class Settings():
    model: str = os.getenv("MODEL")
    embedding_model: str = os.getenv("EMBEDDING_MODEL")
    memory_key: str = "chat_history"
    input_key: str = "input"
