from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory



_session_histories: dict[str, BaseChatMessageHistory] = {}

def get_session_history(session_id:str) -> BaseChatMessageHistory:
    if session_id not in _session_histories:
        _session_histories[session_id] = InMemoryChatMessageHistory()
    return _session_histories[session_id]
