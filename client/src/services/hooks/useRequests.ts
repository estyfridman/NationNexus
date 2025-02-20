import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllRoleRequests } from '../roleService';

export const useRequests = () => {
  return useQuery({
    queryKey: ['requests'],
    queryFn: getAllRoleRequests,
    staleTime: Infinity,
  });
};
