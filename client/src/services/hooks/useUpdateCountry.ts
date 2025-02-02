
import {  useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCountries, updateCountry } from '../countriesService';
import { ICountry, ICountryUpdate } from '../../models/iCountry';


export const useUpdateCountry = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateCountry,
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["Countries"] });
        const previousCountries = queryClient.getQueryData<ICountry[]>(["Countries"]);
        return { previousCountries };
      },
      onSuccess: ({ id, updatedData }: { id: string; updatedData: ICountryUpdate }) => {
        queryClient.setQueryData<ICountry[] | undefined>(["Countries"], (old) =>
          old?.map((oldCountry) => (oldCountry._id === id ? { ...oldCountry, ...updatedData } : oldCountry))
        );
      },
    });
  };