"use client"
import {  useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCountries, updateCountry } from '../bookService';
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

export const useUpdateCountry = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateCountry,
      onMutate: async ({ id, updatedData }: { id: string; updatedData: ICountryUpdate }) => {
        await queryClient.cancelQueries({ queryKey: ["Countries"] });
  
        const previousCountries = queryClient.getQueryData<ICountry[]>(["Countries"]);
  
        queryClient.setQueryData<ICountry[] | undefined>(["Countries"], (old) =>
          old?.map((oldCountry) => (oldCountry._id === id ? { ...oldCountry, ...updatedData } : oldCountry))
        );
  
        return { previousCountries };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["Countries"] });
      },
    });
  };