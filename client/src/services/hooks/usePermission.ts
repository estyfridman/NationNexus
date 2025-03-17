import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {grantPermission} from '../userService';
import logger from '../../utils/logger';
import {updateRequestStatus, getAllPermissionRequests} from '../permissionService';
import {FUNCS} from '../../constants/constants';
import {RoleRequestStatusEnum} from '../../models/enums/RoleRequestStatusEnum';
import IUser from '../../models/interfaces/iUser';
import {IPermissionRequest} from '../../models/interfaces/iPermissionRequest';

export const useRequests = () => {
  return useQuery({
    queryKey: ['requests'],
    queryFn: getAllPermissionRequests,
    staleTime: Infinity,
  });
};

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRequestStatus,
    onSuccess: (updatedRequest) => {
      queryClient.setQueryData<IPermissionRequest[] | undefined>(['requests'], (old) => {
        if (!old) return undefined;
        return old.map((request) => (request._id === updatedRequest._id ? updatedRequest : request));
      });
      if (updatedRequest.status === RoleRequestStatusEnum.APPROVED) {
        queryClient.setQueryData<IUser[] | undefined>(['Users'], (oldUsers) => {
          if (!oldUsers) return undefined;

          return oldUsers.map((user) => {
            if (user._id === updatedRequest.userId) {
              const currentPermissions = user.permissions ?? [];
              const isAlreadyAssigned = currentPermissions.includes(updatedRequest.requested);
              return isAlreadyAssigned ? user : {...user, permissions: [...currentPermissions, updatedRequest.requested]};
            }
            return user;
          });
        });
      }
    },
    onError: (error) => {
      logger.error(FUNCS.ERR_UPDATE_STATUS(error.message));
    },
  });
};

export const useGrantPermissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: grantPermission,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<IPermissionRequest[] | undefined>(['requests'], (old) => {
        if (!old) return undefined;
        return old.map((request) => {
          if (request.userId._id === updatedUser.userId) {
            return {...request, status: RoleRequestStatusEnum.APPROVED};
          }
          return request;
        });
      });
    },
    onError: (error) => {
      logger.error(FUNCS.ERR_PERMISSION(error.message));
    },
  });
};
