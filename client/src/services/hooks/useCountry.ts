import {QueryObserverResult, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getAllCountries, createCountry, deleteCountry, updateCountry} from '../countriesService';
import {ICountry, ICountryUpdate} from '../../models/interfaces/iCountry';
import {errorAlert} from '../../utils/sweet-alerts';
import logger from '../../utils/logger';

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

export const getCountryById = (id: string) => {
  const queryClient = useQueryClient();
  const Countries = queryClient.getQueryData<ICountry[]>(['Countries']);
  if (Countries) {
    return Countries.find((country) => country._id === id);
  }
  return null;
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCountry,
    onSuccess: (newCountry: ICountry) => {
      queryClient.setQueryData<ICountry[] | undefined>(['Countries'], (old) => {
        return old ? [...old, newCountry] : [newCountry];
      });
    },
    onError: (error, newCountry, context) => {
      errorAlert(`${error} - ${newCountry} - ${context}`);
      logger.error(`Error: ${error.message} - ${newCountry.name} in ${new Date().toLocaleString()}`);
    },
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCountry,
    onSuccess: ({id, updatedData}: {id: string; updatedData: ICountryUpdate}) => {
      queryClient.setQueryData<ICountry[] | undefined>(['Countries'], (old) =>
        old?.map((oldCountry) => (oldCountry._id === id ? {...oldCountry, ...updatedData} : oldCountry))
      );
    },
    onError: (error: Error, variables: {id: string; updatedData: ICountryUpdate}, context) => {
      errorAlert(`${error} - ${variables.id} - ${context}`);
      logger.error(`Error updating country: ${error.message} in ${new Date().toLocaleString()}`);
    },
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCountry,
    onSuccess: (deletedCountry: ICountry) => {
      queryClient.setQueryData<ICountry[]>(['Countries'], (oldData) => oldData?.filter((country) => country._id !== deletedCountry._id) ?? []);
    },
    onError: (err: Error, id: string, context) => {
      errorAlert(`${err} - ${id} - ${context}`);
      logger.error(`Error delete country: ${err.message} in ${new Date().toLocaleString()}`);
    },
  });
};
