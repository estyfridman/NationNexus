import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { getAllCities, getCitiesByCountryId } from '../../citiesService';
import ICity from '../../../models/interfaces/iCity';

export const useFetchCities = (): QueryObserverResult<ICity[], any> => {
  return useQuery<ICity[], any>({
    queryFn: async () => {
      const cities = await getAllCities();
      return cities;
    },
    queryKey: ['cities'],
  });
};

export const useFetchCitiesByCountryId = (countryId: string): QueryObserverResult<ICity[], any> => {
  return useQuery<ICity[], any>({
    queryFn: async () => {
      try {
        const cities = await getCitiesByCountryId(countryId);
        return cities;
      } catch (error) {
        return [];
      }
    },
    queryKey: ['cities', countryId],
  });
};
