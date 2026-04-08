from fastapi import FastAPI
from .api import router
import logging
logger = logging.getLogger(__name__)
app = FastAPI()

app.include_router(router,prefix="/api/v1")
@app.get("/")
def read_root():
    return {"Hello": "World"}
