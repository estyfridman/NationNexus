import { atom } from 'recoil';
import IUser from '../../models/interfaces/iUser';

interface UserState {
  user: IUser | null;
  token: string | null;
}

export const userState = atom<UserState>({
  key: 'userState',
  default: {
    user: null,
    token: null,
  },
});

//import.meta.env.DEV ? `userState_${Date.now()}` : 'userState',
// {
//   firstName: 'Esty',
//   lastName: 'Friedman',
//   username: 'Esty Friedman',
//   email: 'admin@gmail.com',
//   phone: '0522447889',
//   password: '12345',
//   profileImage: '/images/admina.jpg',
//   role: 'admin',
//   createdAt: new Date(),
// },
