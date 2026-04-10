from langchain_core.runnables.history import RunnableWithMessageHistory

from app.services.model import init_model
from app.services.prompt import get_prompt
from app.memory.memory import get_session_history
from app.core.settings import Settings

def build_chat_chain() -> RunnableWithMessageHistory:
    prompt = get_prompt()
    llm = init_model()

    runnable = prompt | llm
    return RunnableWithMessageHistory(
        runnable=runnable,
        get_session_history=get_session_history,
        input_messages_key=Settings.input_key,
        history_messages_key=Settings.memory_key

    )


