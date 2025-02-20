import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedRole: { type: String, enum: ['ADMIN', 'USER', 'GUEST'], required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('RoleRequest', requestSchema);
