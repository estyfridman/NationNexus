
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCountry } from '../countriesService';
import { ICountry } from '../../models/iCountry';

export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCountry,
    onSuccess: (newCountry: ICountry) => {
      queryClient.setQueryData<ICountry[] | undefined>(["Countries"], (old) => {
        return old ? [...old, newCountry] : [newCountry];
      });
    },
    onError: (error, newCountry, context) => {
      //qsweet-aletr
    },
  });
};
