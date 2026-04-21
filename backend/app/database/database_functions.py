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
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
    '''))
    conn.execute(text('''
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    chat_id INTEGER NOT NULL,
                    sender TEXT NOT NULL,
                    content TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (chat_id) REFERENCES chats(id)
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
    #with engine.connect() as conn:
       # chat_row = conn.execute(text(f"SELECT id, content, timestamp FROM chats WHERE id = {chat_id}")).fetchone()
    try:
        df = pd.read_sql_query(f"SELECT * FROM chats WHERE id = {chat_id}", engine)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        print(df)
        return df.to_dict(orient='records')
    except:
        return None
    

def create_chat() -> int:
    with engine.begin() as conn:
        result = conn.execute(text("INSERT INTO chats (created_at) VALUES (:created_at)"), {"created_at": dt.datetime.now()})
        return result.lastrowid

def insert_message(chat_id: int, sender: str, content: str) -> dict:
    with engine.begin() as conn:
        result = conn.execute(text("INSERT INTO messages (chat_id, sender, content) VALUES (:chat_id, :sender, :content)"), {
            "chat_id": chat_id,
            "sender": sender,
            "content": content
        })
        last_id = result.lastrowid
    
    with engine.connect() as conn:
        new_message = conn.execute(text(f"SELECT * FROM messages WHERE id = {last_id}")).fetchone()
        if new_message:
            return {
                "id": new_message.id,
                "chat_id": new_message.chat_id,
                "sender": new_message.sender,
                "content": new_message.content,
                "timestamp": new_message.timestamp.isoformat()
            }
    return None


def delete_chat_by_id(chat_id: int) -> bool:
    with engine.begin() as conn:
        result = conn.execute(text("DELETE FROM chats WHERE id = :chat_id"), {"chat_id": chat_id})
        return result.rowcount > 0

def update_chat_by_id(chat_id: int, chat: CHAT) -> dict:
    serialized_content = json.dumps(chat.content)
    with engine.begin() as conn:
        result = conn.execute(text(
            "UPDATE chats SET content = :content, timestamp = :timestamp WHERE id = :chat_id"
        ), {
            "content": serialized_content,
            "timestamp": chat.timestamp,
            "chat_id": chat_id
        })
        if result.rowcount > 0:
            return get_chat_by_id(chat_id)
    return None