import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  propertyID: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  renterID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
  datePosted: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);
