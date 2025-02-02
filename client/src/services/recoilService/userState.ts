import { atom } from 'recoil';
import IUser from '../../models/iUser'

export const userState = atom({
  key: import.meta.env.DEV 
  ? `userState_${Date.now()}` 
  : 'userState',
    default: { 
    user: { firstName: 'Esty', lastName: 'Friedman', username: 'Esty Friedman', email: '', phone : '', password: '', profileImage: '/images/admina.jpg', role: 'guest', createdAt : new Date() }, 
    token: '' 
  } as { 
    user: IUser; 
    token: string;
  },
});