import sqlite3
import os
import json
from pydantic import BaseModel


class CHAT(BaseModel):
    content: list[str]
    timestamp: str


database_path = os.path.join(os.path.dirname(__file__), 'RAG_database.db')
conn = sqlite3.connect(database_path)


cursor = conn.cursor()



cursor.execute('''
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
''')

def insert_chat(chat: CHAT):
    serialized_content = json.dumps(chat.content)
    cursor.execute('''
        INSERT INTO posts (content, timestamp)
        VALUES (?, ?)
    ''', (serialized_content, chat.timestamp))
    conn.commit()