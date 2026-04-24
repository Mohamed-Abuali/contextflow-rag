import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../backend/app/database/RAG_database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      db.run(`ALTER TABLE chats ADD COLUMN ai_canonical_id TEXT`, (err) => {
        if (err) {
          if (err.message.includes('duplicate column name')) {
            console.log('Column ai_canonical_id already exists.');
          } else {
            console.error('Error adding column to chats table', err.message);
            return;
          }
        } else {
          console.log('Column ai_canonical_id added to chats table.');
        }
      });

      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_canonical_id ON chats (ai_canonical_id)`, (err) => {
        if (err) {
          console.error('Error creating unique index', err.message);
        } else {
          console.log('Unique index on ai_canonical_id created or already exists.');
        }
        db.close();
      });
    });
  }
});
