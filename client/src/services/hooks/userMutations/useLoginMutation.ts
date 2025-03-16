import {useMutation, useQueryClient} from '@tanstack/react-query';
import {loginUser} from '../../../services/userService';
import {useSetRecoilState} from 'recoil';
import {userState} from '../../recoilService/userState';
import logger from '../../../utils/logger';

export const useLoginMutation = () => {
  const setUserState = useSetRecoilState(userState);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUserState({
        user: data.user,
        token: data.token,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      logger.error(`Login failed ${error.message}`);
    },
  });
};
