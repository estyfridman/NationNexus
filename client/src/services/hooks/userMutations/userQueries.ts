import { useQuery } from '@tanstack/react-query';
import IUser from '../../../models/interfaces/iUser';
import { getUserById } from '../../../services/userService';
import logger from '../../../utils/logger';

export const useSelectedUser = (id: string | undefined, isEditMode: boolean) => {
  return useQuery<IUser | undefined>({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return undefined;

      try {
        const user = await getUserById(id);
        return user;
      } catch (error) {
        logger.error(`Error fetching user: ${(error as Error).message}`);
        return undefined;
      }
    },
    enabled: isEditMode && !!id,
    staleTime: Infinity,
  });
};
