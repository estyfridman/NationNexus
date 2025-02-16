import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCity } from '../../citiesService';
import ICity from '../../../models/interfaces/iCity';
import { errorAlert } from '../../../utils/sweet-alerts';
import logger from '../../../utils/logger';

export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCity,
    onSuccess: (newCity: ICity) => {
      queryClient.setQueryData<ICity[]>(['cities'], (oldData) => {
        return oldData ? [...oldData, newCity] : [newCity];
      });
    },
    onError: (error) => {
      errorAlert(error?.message || 'Failed to create city.');
      logger.error(`Error creating city: ${error.message}`);
    },
  });
};
