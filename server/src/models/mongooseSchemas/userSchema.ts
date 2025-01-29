import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  phone: String,
  password: { type: String, unique: true},
  profileImage: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>("User", UserSchema);
