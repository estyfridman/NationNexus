import mongoose from 'mongoose';
import {RoleRequestStatusEnum} from '../enums/RoleRequestStatusEnum';
import {PermissionEnum} from '../enums/permissionEnum';

const requestSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  requested: {type: String, enum: Object.values(PermissionEnum), required: true},
  status: {type: String, enum: Object.values(RoleRequestStatusEnum), default: RoleRequestStatusEnum.PENDING},
  createdAt: {type: Date, default: Date.now},
});

export default mongoose.model('PermissionRequest', requestSchema);
