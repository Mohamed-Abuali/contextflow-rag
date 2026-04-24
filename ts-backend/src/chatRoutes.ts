import { Router } from 'express';
import { ChatController } from './ChatController';

const router = Router();

router.post('/chats/check-and-save', ChatController.checkAndSave);
router.get('/chats', ChatController.getAll);
router.get('/chats/:id', ChatController.getById);
router.delete('/chats/:id', ChatController.delete);

export default router;
