import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { sendMessage, getConversation } from '../controllers/messageController.js';

const router = Router();

router.post('/', auth, body('receiverID').notEmpty(), body('content').notEmpty(), sendMessage);
router.get('/conversation/:userId', auth, getConversation);

export default router;
