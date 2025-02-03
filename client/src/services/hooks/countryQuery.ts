import {  useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCountries } from '../countriesService';
import { ICountry } from '../../models/iCountry';

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
