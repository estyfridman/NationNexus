import mongoose from 'mongoose';
import {RoleRequestStatusEnum} from '../enums/RoleRequestStatusEnum';
import {PermissionEnum} from '../enums/permissionEnum';
import {VALID} from '../../constants';

const permissionRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, VALID.REQUIRED_USER_ID],
    validate: {
      validator: function (value: mongoose.Types.ObjectId) {
        return mongoose.Types.ObjectId.isValid(value);
      },
      message: VALID.INVALID_USER_ID,
    },
  },
  requested: {
    type: String,
    enum: {
      values: Object.values(PermissionEnum),
      message: VALID.INVALID_PERMISSION,
    },
    required: [true, VALID.REQUIRED_PERMISSION],
  },
  status: {
    type: String,
    enum: {
      values: Object.values(RoleRequestStatusEnum),
      message: VALID.INVALID_STATUS,
    },
    default: RoleRequestStatusEnum.PENDING,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

export default mongoose.model('PermissionRequest', permissionRequestSchema);
