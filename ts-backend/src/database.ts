import sqlite3 from 'sqlite3';
import path from 'path';

const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : path.resolve(__dirname, '../../../backend/app/database/RAG_database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    if (!isTest) {
      console.log('Connected to the SQLite database.');
    }
  }
});

if (isTest) {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ai_canonical_id TEXT UNIQUE
      )
    `);
  });
}

export default db;
