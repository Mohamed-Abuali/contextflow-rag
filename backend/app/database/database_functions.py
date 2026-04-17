import sqlite3
import os
import json
from pydantic import BaseModel
import pandas as pd
from sqlalchemy import text, create_engine
import datetime as dt
import uuid


class CHAT(BaseModel):
    content: list[str]
    timestamp: dt.datetime

database_path = os.path.join(os.path.dirname(__file__), 'RAG_database.db')

engine = create_engine(f'sqlite:///{database_path}')




with engine.connect() as conn:
    conn.execute(text('''
                CREATE TABLE IF NOT EXISTS chats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
    '''))

def insert_chat(chat: CHAT) -> dict:
    serialized_content = json.dumps(chat.content)
    
    with engine.begin() as conn: # Manages transaction and commits
        result = conn.execute(text(
            "INSERT INTO chats (content, timestamp) VALUES (:content, :timestamp)"
        ), {
            "content": serialized_content,
            "timestamp": chat.timestamp
        })
        last_id = result.lastrowid

    if last_id:
        with engine.connect() as conn:
            new_chat_row = conn.execute(text(f"SELECT id, content, timestamp FROM chats WHERE id = {last_id}")).fetchone()
            if new_chat_row:
                return {
                    "id": new_chat_row.id,
                    "content": json.loads(new_chat_row.content),
                    "timestamp": new_chat_row.timestamp.isoformat()
                }
    return None

def get_all_chats() -> list:
    df = pd.read_sql_query("SELECT * FROM chats", engine)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    return df.to_dict(orient='records')

def get_chat_by_id(chat_id: int) -> dict:
    df = pd.read_sql_query(f"SELECT * FROM chats WHERE id={chat_id}", engine)
    if not df.empty:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        return df.to_dict(orient='records')[0]
    return None