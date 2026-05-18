import os
from functools import lru_cache
from pydantic import Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# The path to the settings file
SETTINGS_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "settings.json")

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Security settings
    secret_key: str = Field(..., env="SECRET_KEY")
    algorithm: str = Field("HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(15, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    
    # Database settings
    database_url: str = Field("sqlite:///./backend/app/database/RAG_DB.db", env="DATABASE_URL")
    
    # CORS settings
    cors_origins: str = Field("http://localhost:3000", env="CORS_ORIGINS")
    
    # Vector store settings
    vector_store_path: str = Field("./backend/app/data/vector_store", env="VECTOR_STORE_PATH")
    
    # Rate limiting settings
    rate_limit_per_minute: int = Field(60, env="RATE_LIMIT_PER_MINUTE")
    login_rate_limit_per_hour: int = Field(5, env="LOGIN_RATE_LIMIT_PER_HOUR")
    
    class Config:
        model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

from dotenv import load_dotenv

load_dotenv()

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()