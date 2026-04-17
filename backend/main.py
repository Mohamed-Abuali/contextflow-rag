from fastapi import FastAPI
from app.api.endpoints.chat import router as chat_router
from app.api.endpoints.settings import router as settings_router
from app.api.endpoints.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints.history_chat import router as history_chat_router

import logging


logger = logging.getLogger(__name__)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(settings_router)
app.include_router(history_chat_router)



@app.get("/")
def read_root():
    return {"Hello": "World"}
