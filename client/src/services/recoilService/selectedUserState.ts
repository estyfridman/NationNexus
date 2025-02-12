import { atom } from 'recoil';
import IUser from '../../models/interfaces/iUser';

export const selectedUserState = atom<IUser | null>({
  key: 'selectedUserState',
  default: null,
});
