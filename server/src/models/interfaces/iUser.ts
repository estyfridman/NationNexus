

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}
