import {useEffect} from 'react';
import {useSetRecoilState} from 'recoil';
import {userState} from '../../services/recoilService/userState';
import IUser from '../../models/interfaces/iUser';
import {useQueryClient} from '@tanstack/react-query';

export const useAuth = () => {
  const setUserState = useSetRecoilState(userState);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      const parsedUser = JSON.parse(user);
      queryClient.setQueryData(['User'], parsedUser);

      setUserState({
        user: JSON.parse(user) as IUser,
        token,
      });
    }
  }, [queryClient, setUserState]);
};
