import mongoose, { Document } from 'mongoose';
import { IUser } from '../interfaces/iUser';

const UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: { type: String, required: true, unique: true },
  profileImage: String,
  role: { type: String, enum: ['admin', 'user', 'guest'], default: 'guest' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
