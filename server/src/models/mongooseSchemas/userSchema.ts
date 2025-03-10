import mongoose from 'mongoose';
import {IUser} from '../interfaces/iUser';
import {RoleEnum} from '../enums/roleEnum';
import {PermissionEnum} from '../enums/permissionEnum';

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
  username: {type: String, required: true, unique: true},
  email: {type: String, unique: true},
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {type: String, required: true, unique: true},
  profileImage: String,
  role: {type: String, enum: Object.values(RoleEnum), default: RoleEnum.USER},
  permissions: {type: [String], enum: Object.values(PermissionEnum), default: [PermissionEnum.VIEW], required: false},
  createdAt: {type: Date, default: Date.now},
});

export default mongoose.model<IUser>('User', UserSchema);
