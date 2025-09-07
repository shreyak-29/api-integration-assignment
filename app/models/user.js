import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
  hasPurchased: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);