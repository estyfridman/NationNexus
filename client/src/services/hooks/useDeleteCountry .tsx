import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCountry } from '../countriesService';
import { ICountry } from '../../models/iCountry';

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCountry,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["Countries"] });
      const previousCountries = queryClient.getQueryData<ICountry[]>(["Countries"]);
      return { previousCountries };
    },
    onError: (err: Error, id: string, context) => {
      if (context?.previousCountries) {
        queryClient.setQueryData(["Countries"], context.previousCountries);
      }
      console.error(`Error deleting the ${id} country:`, err);
    },
    onSuccess: (deletedCountry: ICountry) => {
      queryClient.setQueryData<ICountry[]>(["Countries"], (oldData) =>
        oldData?.filter((country) => country._id !== deletedCountry._id) ?? [] 
      );
    },
  });
};
