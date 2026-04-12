from pydantic import BaseModel, Field
from typing import List, Optional

class SettingsModel(BaseModel):
    profile_id: str = "prof_01"
    name: str = "Technical Support Agent"
    description: str = "Handles product troubleshooting & API docs"
    is_active: bool = True
    personality: str = "You are a precise, solution-focused assistant..."
    tone: str = "professional"
    style: str = "structured"
    guidelines_text: str = "- Never guess endpoints\n- Always cite version numbers"
    guidelines_files: List[str] = Field(default_factory=list)
    enforce_strictly: bool = True
    knowledge_files: List[str] = Field(default_factory=list)
    knowledge_urls: List[str] = Field(default_factory=list)
    snippets: List[str] = Field(default_factory=list)
    chunk_size: int = 500
    overlap: int = 10
    embed_model: str = "text-embedding-3-small"
    retrieval_k: int = 4
    use_reranker: bool = True
    fallback_mode: str = "use_base_knowledge"
    safety_level: str = "strict"
    llm_model: str = "gpt-4o"