import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getAllUsers, deleteUser, updateUser, grantPermission, updatePermissionUser, registerUser, loginUser} from '../userService';
import IUser, {IUserUpdate} from '../../models/interfaces/iUser';
import {errorAlert} from '../../utils/sweet-alerts';
import logger from '../../utils/logger';
import {getUserById} from '../userService';
import {FUNCS} from '../../constants/constants';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {userState} from '../recoilService/userState';
import {RoleEnum} from '../../models/enums/RoleEnum';

export const useGetUsers = () => {
  return useQuery<IUser[]>({
    queryKey: ['Users'],
    queryFn: getAllUsers,
  });
};

export const useGetUserById = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery<IUser, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      const cachedUsers = queryClient.getQueryData<IUser[]>(['Users']);
      const userFromCache = cachedUsers?.find((user) => user._id === id);

      if (userFromCache) {
        return userFromCache;
      }

      const userFromApi = await getUserById(id);
      queryClient.setQueryData(['user'], userFromApi);
      return userFromApi;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: ({id, updatedData}: {id: string; updatedData: IUserUpdate}) => {
      queryClient.setQueryData<IUser[] | undefined>(['Users'], (old) =>
        old?.map((oldUser) => (oldUser._id === id ? {...oldUser, ...updatedData} : oldUser))
      );
    },
    onError: (error, variables, context) => {
      errorAlert(`${error} - ${variables.id} - ${context}`);
      logger.error(FUNCS.ERR_UPDATE_USER(error.message));
    },
  });
};

export const useUpdatePermissionUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePermissionUser,
    onSuccess: ({id, updatedData}: {id: string; updatedData: IUserUpdate}) => {
      queryClient.setQueryData<IUser[] | undefined>(['Users'], (old) =>
        old?.map((oldUser) => (oldUser._id === id ? {...oldUser, ...updatedData} : oldUser))
      );
    },
    onError: (error, variables, context) => {
      errorAlert(`${error} - ${variables.id} - ${context}`);
      logger.error(FUNCS.ERR_UPDATE_USER(error.message));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: ({deletedUserId}) => {
      queryClient.setQueryData<IUser[] | undefined>(['Users'], (old) => (old ? old.filter((user) => user._id !== deletedUserId) : []));
    },
    onError: (error, id, context) => {
      errorAlert(`${error} - ${id} - ${context}`);
      logger.error(FUNCS.ERR_DELETE_USER(error.message));
    },
  });
};

export const useGrantPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: grantPermission,
    onSuccess: ({userId, updatedUser}: {userId: string; updatedUser: IUser}) => {
      queryClient.setQueryData<IUser[] | undefined>(['Users'], (oldUsers) =>
        oldUsers?.map((user) => (user._id === userId ? {...updatedUser, id: updatedUser._id} : user))
      );
    },
    onError: (error, {userId}, context) => {
      errorAlert(`${error} - ${userId} - ${context}`);
      logger.error(FUNCS.ERR_GRANT_PERMISSION(error.message, userId));
    },
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
      queryClient.setQueryData(['User'], data.user);

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
      logger.error(`Error: ${error.message} - Create User - in ${new Date().toLocaleString()}`);
    },
  });
};
