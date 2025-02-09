import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCountry } from '../countriesService';
import { ICountry } from '../../models/interfaces/iCountry';
import { errorAlert } from '../../utils/sweet-alerts';
import logger from '../../utils/logger';

export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCountry,
    onSuccess: (newCountry: ICountry) => {
      queryClient.setQueryData<ICountry[] | undefined>(['Countries'], (old) => {
        return old ? [...old, newCountry] : [newCountry];
      });
    },
    onError: (error, newCountry, context) => {
      errorAlert(`${error} - ${newCountry} - ${context}`);
      logger.error(
        `Error: ${error.message} - ${newCountry.name} in ${new Date().toLocaleString()}`
      );
    },
  });
};
