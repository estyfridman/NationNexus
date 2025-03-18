import {useQuery} from '@tanstack/react-query';
import IUser from '../../models/interfaces/iUser';
import {getUserById, loginUser} from '../../services/userService';
import logger from '../../utils/logger';
import {FUNCS, ERRORS} from '../../constants/constants';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {} from '../../services/userService';
import {useSetRecoilState} from 'recoil';
import {userState} from '../recoilService/userState';
import {useEffect} from 'react';

export const useCurrentUser = (id: string | undefined, isEditMode: boolean) => {
  return useQuery<IUser | undefined>({
    queryKey: ['user'],
    queryFn: async () => {
      if (!id) return undefined;

      try {
        const user = await getUserById(id);
        return user;
      } catch (error) {
        logger.error(FUNCS.ERR_FETCH_USER((error as Error).message));
        return undefined;
      }
    },
    enabled: isEditMode && !!id,
    staleTime: Infinity,
  });
};

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

const logoutUser = async () => {
  return new Promise<void>((resolve) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    resolve();
  });
};

export const useLogoutMutation = () => {
  const setUserState = useSetRecoilState(userState);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user']});
      queryClient.removeQueries({queryKey: ['user']});
      setUserState({
        user: null,
        token: null,
      });

      logger.info(ERRORS.USER_LOGOUT);
    },
    onError: (error) => {
      logger.error(FUNCS.ERR_LOGOUT(error.message));
    },
  });
};
