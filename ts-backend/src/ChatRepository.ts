import db from './database';

export interface Chat {
  id: number;
  content: string;
  timestamp: string;
  ai_canonical_id?: string;
}

export class ChatRepository {
  public static findByCanonicalId(ai_canonical_id: string): Promise<Chat | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM chats WHERE ai_canonical_id = ?', [ai_canonical_id], (err, row: Chat) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  public static create(content: string, ai_canonical_id: string): Promise<Chat> {
    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString();
      db.run('INSERT INTO chats (content, timestamp, ai_canonical_id) VALUES (?, ?, ?)', [content, timestamp, ai_canonical_id], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, content, timestamp, ai_canonical_id });
      });
    });
  }

  public static update(id: number, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString();
      db.run('UPDATE chats SET content = ?, timestamp = ? WHERE id = ?', [content, timestamp, id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  public static findAll(): Promise<Chat[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM chats', [], (err, rows: Chat[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  public static findById(id: number): Promise<Chat | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM chats WHERE id = ?', [id], (err, row: Chat) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  public static delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM chats WHERE id = ?', [id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
