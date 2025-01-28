"use client"
import {  useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCountries, updateCountry } from '../countriesService';
import { ICountry, ICountryUpdate } from '../../models/iCountry';

export const getCountries = () => {
    return useQuery<ICountry[]>({
      queryKey: ["Countries"],
      queryFn: getAllCountries,
      staleTime: 1000000,
    });
};
  
export const getCountryById = (id: string) => {
    const queryClient = useQueryClient();
    const Countries = queryClient.getQueryData<ICountry[]>(["Countries"]);
    if (Countries) {
      return Countries.find(country => country._id === id);
    }
    return null;
};
// export const useAddState = () => {
//   const queryClient = useQueryClient();
//   return useMutation(addState, {
//     onSuccess: (newState) => {
//       queryClient.setQueryData(["Countries"], (oldStates: ICountry[] | undefined) => {
//         return oldStates ? [...oldStates, newState] : [newState];
//       });
//     },
//   });
// };


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