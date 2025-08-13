import { Router } from 'express';
import { listChats, getConversation, sendMessage, updateStatus } from '../controllers/messages.js';

const router = Router();

router.get('/chats', listChats);
router.get('/messages/:wa_id', getConversation);
router.post('/messages', sendMessage);
router.patch('/messages/status', updateStatus);

export default router;
