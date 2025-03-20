import mongoose from 'mongoose';
import {IUser} from '../interfaces/iUser';
import {RoleEnum} from '../enums/roleEnum';
import {PermissionEnum} from '../enums/permissionEnum';
import {VALID} from '../../constants';

const UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: [true, VALID.REQUIRED_FNAME],
    trim: true,
    minlength: [2, VALID.MIN_LEN_FNAME],
    maxlength: [50, VALID.MAX_LEN_FNAME],
  },
  lastName: {
    type: String,
    required: [true, VALID.REQUIRED_LNAME],
    trim: true,
    minlength: [2, VALID.MIN_LEN_LNAME],
    maxlength: [50, VALID.MAX_LEN_LNAME],
  },
  username: {
    type: String,
    required: [true, VALID.REQUIRED_USERNAME],
    unique: true,
    minlength: [2, VALID.MIN_LEN_USERNAME],
    maxlength: [50, VALID.MAX_LEN_USERNAME],
  },
  email: {
    type: String,
    unique: [true, VALID.UNIQUE_EMAIL],
    required: [true, VALID.REQUIRED_EMAIL],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, VALID.INVALID_EMAIL],
  },
  phone: {
    type: String,
    required: [true, VALID.REQUIRED_PHONE],
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, VALID.INVALID_PHONE],
  },
  password: {type: String, required: true, unique: true},
  profileImage: String,
  role: {type: String, enum: Object.values(RoleEnum), default: RoleEnum.USER},
  permissions: {type: [String], enum: Object.values(PermissionEnum), default: [PermissionEnum.VIEW], required: false},
  createdAt: {type: Date, default: Date.now},
});

export default mongoose.model<IUser>('User', UserSchema);
