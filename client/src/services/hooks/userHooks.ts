import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getAllUsers, registerUser, deleteUser, loginUser, updateUser, grantPermission} from '../userService';
import IUser, {IUserUpdate} from '../../models/interfaces/iUser';
import {errorAlert} from '../../utils/sweet-alerts';
import logger from '../../utils/logger';
import {useSetRecoilState} from 'recoil';
import {userState} from '../recoilService/userState';

export const useGetUsers = () => {
  return useQuery<IUser[]>({
    queryKey: ['Users'],
    queryFn: getAllUsers,
    staleTime: 1000000,
  });
};

export const useGetUserById = (id: string) => {
  const queryClient = useQueryClient();
  const users = queryClient.getQueryData<IUser[]>(['Users']);
  const userFromUsers = users ? users.find((user) => user._id === id) : null;

  const userFromCache = queryClient.getQueryData<IUser>(['user', id]);

  return userFromUsers || userFromCache || null;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const setUserState = useSetRecoilState(userState);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUserState({
        user: data.user,
        token: data.token,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['Users'], (oldUsers: any) => {
        return oldUsers ? [...oldUsers, data.user] : [data.user];
      });
    },
    onError: (error, newUser, context) => {
      errorAlert(`${error} - ${newUser} - ${context}`);
      logger.error(`Error: ${error.message} - Create User - in ${new Date().toLocaleString()}`);
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
      logger.error(`Error: ${error.message} - Update User - in ${new Date().toLocaleString()}`);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (id: string) => {
      queryClient.setQueryData<IUser[] | undefined>(['Users'], (old) => (old ? old.filter((user) => user._id !== id) : []));
    },
    onError: (error, id, context) => {
      errorAlert(`${error} - ${id} - ${context}`);
      logger.error(`Error: ${error.message} - Delete User - in ${new Date().toLocaleString()}`);
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
      logger.error(`Error: ${error.message} - Login User - in ${new Date().toLocaleString()}`);
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
    onError: (error, {userId, role}, context) => {
      errorAlert(`${error} - ${userId} - ${role} - ${context}`);
      logger.error(`Error: ${error.message} - GrantPermission - ${userId} - ${role} - ${context} - in ${new Date().toLocaleString()}`);
    },
  });
};
