import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
