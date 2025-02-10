import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../recoilService/userState';
import logger from '../../../utils/logger';

const logoutUser = async () => {
  return new Promise<void>((resolve) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    resolve();
  });
};

export const useLogoutMutation = () => {
  const setUserState = useSetRecoilState(userState);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setUserState({
        user: null,
        token: null,
      });

      logger.info('User successfully logged out');
    },
    onError: (error) => {
      logger.error(`Logout failed: ${error.message}`);
    },
  });
};
