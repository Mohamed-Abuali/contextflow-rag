from langchain.prompts import ChatPromptTemplate,MessagePlaceholder
from .settings import Settings

system_prompt = """
You are a helpful assistant.
"""

def get_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_message([
        ("system",system_prompt),
        (MessagePlaceholder(variable_name=Settings.input_key)),
        ("human",Settings.input_key)
    ])