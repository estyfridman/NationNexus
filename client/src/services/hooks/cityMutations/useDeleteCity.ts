import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCity } from '../../citiesService';
import ICity from '../../../models/interfaces/iCity';
import { errorAlert } from '../../../utils/sweet-alerts';
import logger from '../../../utils/logger';

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCity,
    onSuccess: (response: any, variables, context) => {
      if (response && response.data && response.data._id) {
        const deletedCity: ICity = response.data;
        queryClient.setQueryData<ICity[]>(
          ['cities'],
          (oldData) => oldData?.filter((city) => city._id !== deletedCity._id) ?? []
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['cities'] });
        logger.warn("Deleted city data not received in onSuccess. Invalidating 'cities' query.");
      }
    },
    onError: (err: Error, id: string | undefined, context) => {
      errorAlert(`${err.message}`);
      logger.error(`Error deleting city: ${err.message} in ${new Date().toLocaleString()}`);
    },
  });
};
