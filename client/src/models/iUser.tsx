export default interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  profileImage?: string | File | null;
  role: 'admin' | 'user' | 'guest';
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
}
