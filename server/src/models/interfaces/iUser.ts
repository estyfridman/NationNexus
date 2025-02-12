import { RoleEnum } from '../../../../shared/enums';

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
}
