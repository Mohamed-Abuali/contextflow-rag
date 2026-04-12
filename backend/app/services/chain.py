from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_classic.chains import create_history_aware_retriever,create_retrieval_chain
from langchain_classic.chains.combine_documents import (
    create_stuff_documents_chain,
)

from app.services.retriever import get_retriever
from app.services.model import init_model
from app.services.prompt import get_prompt,get_contextualize_q_prompt,get_qa_prompt
from app.memory.memory import get_session_history
from app.core.settings import Settings

def build_chat_chain() -> RunnableWithMessageHistory:
    #prompt = get_prompt()
    llm = init_model()
    retriever = get_retriever()
    contextualize_q_prompt = get_contextualize_q_prompt()
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    qa_prompt = get_qa_prompt()
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)


    runnable = rag_chain
    return RunnableWithMessageHistory(
        runnable=runnable,
        get_session_history=get_session_history,
        input_messages_key=Settings.input_key,
        history_messages_key=Settings.memory_key,
        output_messages_key=Settings.output_key,

    )


