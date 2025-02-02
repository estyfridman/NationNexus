import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, registerUser, deleteUser, loginUser, updateUser, requestPermission, grantPermission } from '../userService';
import IUser, { IUserUpdate } from '../../models/iUser';

export const useGetUsers = () => {
    return useQuery<IUser[]>({
      queryKey: ["Users"],
      queryFn: getAllUsers,
      staleTime: 1000000,
    });
};

export const useGetUserById = (id: string) => {
    const queryClient = useQueryClient();
    const users = queryClient.getQueryData<IUser[]>(["Users"]);
    return users ? users.find((user) => user._id === id) : null;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onMutate: async (newUser: FormData) => {
      await queryClient.cancelQueries({ queryKey: ["Users"] });
      const previousUsers = queryClient.getQueryData(["Users"]);
      return { previousUsers };
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(["Users"], (oldUsers: any) => {
        return oldUsers ? [...oldUsers, newUser] : [newUser];
      });
    },
    onError: (error, newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["Users"], context.previousUsers);
      }
    },
  });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateUser,
      onMutate: async ({ id, updatedData }: { id: string; updatedData: IUserUpdate }) => {
        await queryClient.cancelQueries({ queryKey: ["Users"] });
        const previousUsers = queryClient.getQueryData<IUser[]>(["Users"]);
        return { previousUsers, updatedData };
      },
      onSuccess: ({ id, updatedData }: { id: string; updatedData: IUserUpdate }) => {
        queryClient.setQueryData<IUser[] | undefined>(["Users"], (old) =>
          old?.map((oldUser) => (oldUser._id === id ? { ...oldUser, ...updatedData } : oldUser))
        );
      },
      onError: (error, variables, context) => {
        if (context?.previousUsers) {
          queryClient.setQueryData<IUser[] | undefined>(["Users"], context.previousUsers);
        }
      },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: deleteUser,
      onMutate: async (id: string) => {
        await queryClient.cancelQueries({ queryKey: ["Users"] });
        const previousUsers = queryClient.getQueryData<IUser[]>(["Users"]);
        return { previousUsers };
      },
      onSuccess: (id: string) => {
        queryClient.setQueryData<IUser[] | undefined>(["Users"], (old) =>
          old ? old.filter((user) => user._id !== id) : []
        );
      },
      onError: (error, id, context) => {
        queryClient.setQueryData<IUser[] | undefined>(["Users"], context?.previousUsers);
      },
    });
};

export const useLoginUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: loginUser,
      onMutate: async (credentials: { username: string; password: string }) => {
        await queryClient.cancelQueries({ queryKey: ["User"] });
        const previousUser = queryClient.getQueryData<IUser>(["User"]);
        return { previousUser };
      },
      onSuccess: (user: IUser) => {
        queryClient.setQueryData(["User"], user);
      },
      onError: (error, credentials, context) => {
        if (context?.previousUser) {
          queryClient.setQueryData(["User"], context.previousUser);
        }
      },
    });
  };
  
  export const useRequestPermission = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: requestPermission,
      onMutate: async (role: "admin" | "user") => {
        await queryClient.cancelQueries({ queryKey: ["User"] });
        const previousUser = queryClient.getQueryData<IUser>(["User"]);
        return { previousUser };
      },
      onSuccess: (updatedUser: IUser) => {
        queryClient.setQueryData(["User"], updatedUser);
      },
      onError: (error, role, context) => {
        if (context?.previousUser) {
          queryClient.setQueryData(["User"], context.previousUser);
        }
      },
    });
  };


export const useGrantPermission = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: grantPermission,
      onMutate: async ({ userId, role }: { userId: string; role: 'admin' | 'user' | 'guest' }) => {
        await queryClient.cancelQueries({ queryKey: ["Users"] });
        const previousUsers = queryClient.getQueryData<IUser[]>(["Users"]);
        return { previousUsers, role };
      },
      onSuccess: ({ userId, updatedUser }: { userId: string; updatedUser: IUser }) => {
        queryClient.setQueryData<IUser[] | undefined>(["Users"], (oldUsers) =>
          oldUsers?.map((user) => (user._id === userId ? updatedUser : user))
        );
      },
      onError: (error, { userId, role }, context) => {
        if (context?.previousUsers) {
          queryClient.setQueryData(["Users"], context.previousUsers);
          console.error(`Error granting permission to user ${userId} with role ${role}:`, error);
        }
      },
    });
  };