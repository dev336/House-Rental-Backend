import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  propertyID: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  renterID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending','approved','rejected','cancelled'], default: 'pending' },
  approvalStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid','paid','refunded'], default: 'unpaid' }
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);
