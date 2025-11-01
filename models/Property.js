import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  city: { type: String, trim: true },
  rentPrice: { type: Number, required: true, min: 0 },
  ownerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availabilityStatus: { type: String, enum: ['available','unavailable'], default: 'available' },
  dateListed: { type: Date, default: Date.now },
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Property', PropertySchema);
