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
