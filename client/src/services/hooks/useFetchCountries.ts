import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { ICountry } from '../../models/interfaces/iCountry';
import { getAllCountries } from '../countriesService';

export const useFetchCountries = (): QueryObserverResult<ICountry[], any> => {
  return useQuery<ICountry[], any>({
    queryFn: async () => {
      try {
        const countries = await getAllCountries();
        return countries;
      } catch (error) {
        return [];
      }
    },
    queryKey: ['Countries'],
  });
};
