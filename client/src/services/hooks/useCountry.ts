import {QueryObserverResult, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getAllCountries, createCountry, deleteCountry, updateCountry} from '../countriesService';
import {ICountry, ICountryUpdate} from '../../models/interfaces/iCountry';
import {errorAlert} from '../../utils/sweet-alerts';
import logger from '../../utils/logger';
import ICity from '../../models/interfaces/iCity';
import {updateCity, deleteCity, createCity} from '../citiesService';
import {ALERT_MESSAGES, FUNCS} from '../../constants';

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

// City Mutate:

export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({city_name, countryId}: {city_name: string; countryId: string}) => createCity(city_name, countryId),

    onSuccess: ({city, countryId}) => {
      queryClient.setQueryData<ICountry[]>(['countries'], (oldCountries) => {
        return oldCountries?.map((country) => (country._id === countryId ? {...country, cityIds: [...(country.cityIds || []), city]} : country));
      });
    },

    onError: (error) => {
      errorAlert(error?.message || ALERT_MESSAGES.ERROR_CREATE_CITY);
      logger.error(FUNCS.ERR_CREATE_CITY(error.message));
    },
  });
};

export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCity,
    onSuccess: ({updatedData}: {updatedData: ICity}) => {
      queryClient.setQueryData<ICountry[] | undefined>(['countries'], (oldCountries) =>
        oldCountries?.map((country) => ({
          ...country,
          cityIds: country.cityIds!.map((city) => (city._id === updatedData._id ? updatedData : city)),
        }))
      );
    },
    onError: (error) => {
      errorAlert(error?.message || ALERT_MESSAGES.ERROR_UPDATE_CITY);
      logger.error(FUNCS.ERR_UPDATE_CITY(error.message));
    },
  });
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCity,
    onSuccess: (data: {cityId: string; countryId: string}) => {
      const {cityId, countryId} = data;

      queryClient.setQueryData<ICountry[]>(['countries'], (oldCountries) => {
        if (!oldCountries) return [];

        return oldCountries.map((country) => {
          if (country._id === countryId) {
            return {
              ...country,
              cityIds: country.cityIds?.filter((city) => city._id !== cityId),
            };
          }
          return country;
        });
      });
    },
    onError: (err: Error, variables: {cityId: string; countryId: string}) => {
      errorAlert(`${err.message}`);
      logger.error(FUNCS.ERR_DELETE_CITY(err.message));
    },
  });
};
