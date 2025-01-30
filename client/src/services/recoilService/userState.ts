import { atom } from 'recoil';
import IUser from '../../models/iUser'

export const userState = atom({
  key: 'userState',
  default: { 
    user: { firstName: 'Esty', lastName: 'Friedman', username: 'Esty Friedman', email: '', phone : '', password: '', profileImage: '/images/admin.jpg', role: 'guest', createdAt : new Date() }, 
    token: '' 
  } as { 
    user: IUser; 
    token: string;
  },
});