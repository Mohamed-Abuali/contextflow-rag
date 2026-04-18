from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, settings, upload, history_chat, new_chat

app = FastAPI()

# CORS Middleware
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(settings.router)
app.include_router(upload.router)
app.include_router(history_chat.router)
app.include_router(new_chat.router)
