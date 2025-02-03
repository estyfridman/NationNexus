import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCountry } from '../countriesService';
import { ICountry } from '../../models/iCountry';
import { errorAlert } from '../../utils/sweet-alerts';
import logger from "../../utils/logger";

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCountry,
    onSuccess: (deletedCountry: ICountry) => {
      queryClient.setQueryData<ICountry[]>(["Countries"], (oldData) =>
        oldData?.filter((country) => country._id !== deletedCountry._id) ?? [] 
      );
    },
    onError: (err: Error, id: string, context) => {
      errorAlert(`${err} - ${id} - ${context}`);
      logger.error(`Error delete country: ${err.message} in ${new Date().toLocaleString()}`);
    },
  });
};
