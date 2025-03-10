import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {grantPermission} from '../userService';
import IRoleRequest from '../../models/interfaces/iRoleRequests';
import logger from '../../utils/logger';
import {updateRequestStatus, getAllPermissionRequests} from '../permissionService';
import {FUNCS} from '../../constants';
import {RoleRequestStatusEnum} from '../../models/enums/RoleRequestStatusEnum';

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
      queryClient.setQueryData<IRoleRequest[] | undefined>(['requests'], (old) => {
        if (!old) return undefined;
        return old.map((request) => (request._id === updatedRequest._id ? updatedRequest : request));
      });
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
      queryClient.setQueryData<IRoleRequest[] | undefined>(['requests'], (old) => {
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
