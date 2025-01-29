

export interface IUser {
  _id? : string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}
