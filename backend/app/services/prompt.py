import json
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from app.core.settings import Settings
from app.core.config import SETTINGS_FILE_PATH
from pathlib import Path

settings_text = Path(SETTINGS_FILE_PATH).read_text()
settings = json.loads(settings_text)

system_prompt = f"{settings['personality']}\n\n{settings['style']}"

def get_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system",system_prompt),
        (MessagesPlaceholder(variable_name=Settings.memory_key)),
        ("human", "{input}")
    ])


def get_contextualize_q_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
def get_qa_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", system_prompt + "\n\nContext:\n{context}"),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
"""
"You are a helpful assistant. Use the following retrieved context to answer the question. If the context doesn't contain the answer, say so.
"""