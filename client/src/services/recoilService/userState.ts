import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: { 
    user: { firstName: 'Esty', lastName: 'Friedman', profileImage: '/images/admin.jpg', role: 'guest' }, 
    token: '' 
  } as { 
    user: { firstName: string; lastName: string; profileImage: string; role: 'admin' | 'user' | 'guest' }; 
    token: string;
  },
});