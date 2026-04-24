import { Request, Response } from 'express';
import { ChatRepository } from './ChatRepository';
import { AIServiceClient } from './AIServiceClient';

export class ChatController {
  public static async checkAndSave(req: Request, res: Response) {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).send({ error: 'Content is required' });
      }

      const contentString = JSON.stringify(content);
      const canonicalId = await AIServiceClient.getCanonicalId(contentString);

      let chat = await ChatRepository.findByCanonicalId(canonicalId);

      if (chat) {
        // Chat exists, update it
        await ChatRepository.update(chat.id, contentString);
        const updatedChat = await ChatRepository.findById(chat.id);
        res.status(200).send({ message: 'Chat updated', chat: updatedChat });
      } else {
        // Chat does not exist, create it
        const newChat = await ChatRepository.create(contentString, canonicalId);
        res.status(201).send({ message: 'Chat created', chat: newChat });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred' });
    }
  }

  public static async getAll(req: Request, res: Response) {
    try {
      const chats = await ChatRepository.findAll();
      res.status(200).send(chats);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred' });
    }
  }

  public static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const chat = await ChatRepository.findById(id);
      if (chat) {
        res.status(200).send(chat);
      } else {
        res.status(404).send({ error: 'Chat not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred' });
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await ChatRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred' });
    }
  }
}
