from fastapi import FastAPI
from app.api.endpoints import chat, settings

app = FastAPI()

app.include_router(chat.router)
app.include_router(settings.router, prefix='/api')
