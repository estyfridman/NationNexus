import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import IUser from '../../models/interfaces/iUser';
import {getUserById, registerUser, loginUser} from '../../services/userService';
import logger from '../../utils/logger';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {userState} from '../recoilService/userState';
import {RoleEnum} from '../../models/enums/RoleEnum';
import {errorAlert} from '../../utils/sweet-alerts';
import {FUNCS} from '../../constants/constants';

export const useCurrentUser = (id: string | undefined, isEditMode: boolean) => {
  return useQuery<IUser | undefined>({
    queryKey: ['user', id],
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const setUserState = useSetRecoilState(userState);
  const currentUser = useRecoilValue(userState);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['Users'], (oldUsers: any) => {
        return oldUsers ? [...oldUsers, data.user] : [data.user];
      });

      if (!(currentUser && currentUser?.user?.role === RoleEnum.ADMIN)) {
        setUserState({
          user: data.user,
          token: data.token,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); //check and delete
      }
    },
    onError: (error, newUser, context) => {
      errorAlert(`${error} - ${newUser} - ${context}`);
      logger.error(FUNCS.ERR_CREATE_USER(error.message));
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user: IUser) => {
      queryClient.setQueryData(['User'], user);
    },
    onError: (error, credentials, context) => {
      errorAlert(`${error} - ${credentials.username} - ${context}`);
      logger.error(FUNCS.ERR_LOGIN(error.message));
    },
  });
};
