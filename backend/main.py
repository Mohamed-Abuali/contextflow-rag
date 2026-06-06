"""Compatibility shim: forward `main:app` to the supported `app.main:app`.

This keeps `python -m uvicorn main:app` working while ensuring all requests are
served by the modern application defined in `app/main.py`. The legacy endpoints
under `app/api/endpoints/` rely on packages (e.g. `langchain_classic`) that are
no longer part of the project's dependencies and must not be imported here.
"""
from app.main import app

__all__ = ["app"]
