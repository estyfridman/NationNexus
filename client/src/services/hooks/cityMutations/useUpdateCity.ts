import { useMutation, useQueryClient } from '@tanstack/react-query';
import ICity, { ICityUpdate } from '../../../models/interfaces/iCity';
import { errorAlert } from '../../../utils/sweet-alerts';
import logger from '../../../utils/logger';
import { updateCity } from '../../citiesService';

export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCity,
    onSuccess: ({ id, updatedData }: { id: string; updatedData: ICityUpdate }) => {
      queryClient.setQueryData<ICity[] | undefined>(['cities'], (old) =>
        old?.map((oldCity) => (oldCity._id === id ? { ...oldCity, ...updatedData } : oldCity))
      );
    },
    onError: (error) => {
      errorAlert(error?.message || 'Failed to update city.');
      logger.error(`Error updating city: ${error.message}`);
    },
  });
};
