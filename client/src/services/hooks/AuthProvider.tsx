import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../services/recoilService/userState';
import IUser from '../../models/iUser';

export const useAuth = () => {
  const setUserState = useSetRecoilState(userState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setUserState({
        user: JSON.parse(user) as IUser,
        token,
      });
    }
  }, [setUserState]);
};
