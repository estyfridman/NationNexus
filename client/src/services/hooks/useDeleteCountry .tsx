import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCountry } from '../countriesService';
import { ICountry } from '../../models/iCountry';

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCountry,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["Countries"] });

      const previousCountries = queryClient.getQueryData<ICountry[]>(["Countries"]);

      // עדכון ה-cache באופן מקומי
      queryClient.setQueryData<ICountry[] | undefined>(["Countries"], (old) =>
        old?.filter((country) => country._id !== id)
      );

      return { previousCountries };
    },
    onError: (err: Error, id: string, context) => {
      if (context?.previousCountries) {
        queryClient.setQueryData(["Countries"], context.previousCountries);
      }
    },
    onSettled: () => {
      //  את זה חייב לשנות זה גורם לקריאות שרת רבות ומיותרות
      queryClient.invalidateQueries({ queryKey: ["Countries"] });
    },
  });
};
