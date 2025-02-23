import {useMutation, useQueryClient} from '@tanstack/react-query';
import {grantPermission, updateRequestStatus} from '../userService';
import IRoleRequest from '../../models/interfaces/iRoleRequests';
import logger from '../../utils/logger';

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
      logger.error(`Error updating status: ${error}`);
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
            return {...request, status: 'APPROVED'};
          }
          return request;
        });
      });
    },
    onError: (error) => {
      logger.error(`Error updating user role: ${error}`);
    },
  });
};
