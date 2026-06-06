import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth_router, chat_router, settings_router, upload_router
from app.core.config import get_settings
from app.database.database import create_tables

logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialise persistent resources at application startup."""
    create_tables()
    try:
        from app.services.vector_store import init_vector_store

        init_vector_store()
        logger.info("Persistent vector store initialised at %s", settings.vector_store_path)
    except Exception as exc:  # pragma: no cover
        logger.warning("Vector store initialisation skipped: %s", exc)
    yield


app = FastAPI(
    title="XAIautopost API",
    description="API for an AI-powered RAG chat application.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[i.strip() for i in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include routers
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router.router, prefix="/chat", tags=["Chat"])
app.include_router(settings_router.router, prefix="/settings", tags=["Settings"])
app.include_router(upload_router.router, prefix="/upload", tags=["Upload"])


@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint to check API status."""
    return {"message": "Welcome to the XAIautopost API!"}
