import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../../services/userService';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../recoilService/userState';
import logger from '../../../utils/logger';

export const useLoginMutation = () => {
  const setUserState = useSetRecoilState(userState);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUserState({
        user: data.user,
        token: data.token,
      });
    },
    onError: (error) => {
      logger.error(`Login failed ${error.message}`);
    },
  });
};
