import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCountry } from '../countriesService';
import { ICountry, ICountryUpdate } from '../../models/interfaces/iCountry';
import { errorAlert } from '../../utils/sweet-alerts';
import logger from '../../utils/logger';

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCountry,
    onSuccess: ({ id, updatedData }: { id: string; updatedData: ICountryUpdate }) => {
      queryClient.setQueryData<ICountry[] | undefined>(['Countries'], (old) =>
        old?.map((oldCountry) =>
          oldCountry._id === id ? { ...oldCountry, ...updatedData } : oldCountry
        )
      );
    },
    onError: (error: Error, variables: { id: string; updatedData: ICountryUpdate }, context) => {
      errorAlert(`${error} - ${variables.id} - ${context}`);
      logger.error(`Error updating country: ${error.message} in ${new Date().toLocaleString()}`);
    },
  });
};
