import {RoleEnum} from '../enums/roleEnum';
import {PermissionEnum} from '../enums/permissionEnum';

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  role: RoleEnum;
  permissions?: PermissionEnum[];
  createdAt: Date;
}

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string | null;
  permissions?: PermissionEnum[];
}
