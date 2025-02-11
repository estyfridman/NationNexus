import mongoose from 'mongoose';

interface IResetToken extends mongoose.Document {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const ResetToken = mongoose.model<IResetToken>('ResetToken', resetTokenSchema);
