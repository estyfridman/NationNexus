import {PermissionEnum} from '../enums/permissionEnum';
import {RoleEnum} from '../enums/RoleEnum';

export default interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  profileImage?: string | File | null;
  role: RoleEnum;
  permissions?: PermissionEnum[];
  createdAt: Date;
}

export interface IUserUpdate extends Partial<IUser> {}

export interface IUserFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  profileImage?: File;
  role: RoleEnum;
  permissions?: PermissionEnum;
}
