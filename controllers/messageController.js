import Message from '../models/Message.js';
import { validationResult } from 'express-validator';

export const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { receiverID, content } = req.body;
    const msg = await Message.create({ senderID: req.user.id, receiverID, content });
    res.status(201).json(msg);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const otherId = req.params.userId;
    const messages = await Message.find({ 
      $or: [
        { senderID: req.user.id, receiverID: otherId },
        { senderID: otherId, receiverID: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
