import mongoose from 'mongoose';
export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (e) {
    console.error('DB error', e.message);
    process.exit(1);
  }
};
