import request from 'supertest';
import express from 'express';
import chatRoutes from '../src/chatRoutes';

const app = express();
app.use(express.json());
app.use('/api', chatRoutes);

describe('Chat API', () => {
  it('should create a new chat if it does not exist', async () => {
    const newChat = { content: [{ role: 'user', content: 'This is a test chat' }] };
    const res = await request(app).post('/api/chats/check-and-save').send(newChat);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Chat created');
    expect(res.body.chat).toHaveProperty('id');
  });

  it('should update an existing chat if it already exists', async () => {
    const newChat = { content: [{ role: 'user', content: 'This is a test chat' }] };
    // First, create the chat
    await request(app).post('/api/chats/check-and-save').send(newChat);
    // Then, send the same content again to update
    const res = await request(app).post('/api/chats/check-and-save').send(newChat);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Chat updated');
  });

  it('should get all chats', async () => {
    const res = await request(app).get('/api/chats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
