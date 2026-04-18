import uuid

def get_chat_id(message: str) -> str:
    """Mock packing service that returns a new UUID for each chat."""
    return str(uuid.uuid4())
