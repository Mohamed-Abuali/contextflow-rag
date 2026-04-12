from pydantic import BaseModel, Field
from typing import List, Optional

class SettingsModel(BaseModel):
    profile_id: Optional[str] = "prof_01"
    name: Optional[str] = "Technical Support Agent"
    description: Optional[str] = "Handles product troubleshooting & API docs"
    is_active: Optional[bool] = True
    personality: Optional[str] = "You are a precise, solution-focused assistant..."
    tone: Optional[str] = "professional"
    style: Optional[str] = "structured"
    guidelines_text: Optional[str] = "- Never guess endpoints\n- Always cite version numbers"
    guidelines_files: Optional[List[str]] = Field(default_factory=list)
    enforce_strictly: Optional[bool] = True
    knowledge_files: Optional[List[str]] = Field(default_factory=list)
    knowledge_urls: Optional[List[str]] = Field(default_factory=list)
    snippets: Optional[List[str]] = Field(default_factory=list)
    chunk_size: Optional[int] = 500
    overlap: Optional[int] = 10
    embed_model: Optional[str] = "text-embedding-3-small"
    retrieval_k: Optional[int] = 4
    use_reranker: Optional[bool] = True
    fallback_mode: Optional[str] = "use_base_knowledge"
    safety_level: Optional[str] = "strict"
    llm_model: Optional[str] = "gpt-4o"