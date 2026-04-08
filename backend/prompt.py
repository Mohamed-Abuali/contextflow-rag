from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from settings import Settings

system_prompt = """
You are a helpful assistant.
"""

def get_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system",system_prompt),
        (MessagesPlaceholder(variable_name=Settings.input_key)),
        ("human",Settings.input_key)
    ])