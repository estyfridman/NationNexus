import {client} from '../api/client';
import ICity, {ICityUpdate} from '../models/interfaces/iCity';
import {handleApiError} from '../utils/error-handler';
import {getAuthHeaders} from '../utils/getAuthorization';
import {PATH, FUNCS} from '../constants';

export async function getAllCities(): Promise<ICity[]> {
  try {
    const response = await client.get<ICity[]>(PATH.CITIES);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
}

export const getCityById = async (id: string): Promise<ICity> => {
  try {
    const response = await client.get<ICity>(FUNCS.CITIES_NAV(id));
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const getCitiesByCountryId = async (countryId: string): Promise<ICity[]> => {
  try {
    const response = await client.get<ICity[]>(FUNCS.CITIES_ID_PATH(countryId));
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const updateCity = async ({updatedData}: {updatedData: ICityUpdate}): Promise<{updatedData: ICity}> => {
  try {
    const response = await client.patch(FUNCS.CITIES_NAV(updatedData._id || ''), updatedData, {headers: getAuthHeaders()});
    return {updatedData: response.data};
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const createCity = async (city_name: string, countryId: string): Promise<{city: ICity; countryId: string}> => {
  try {
    const response = await client.post(PATH.CITIES, {city_name, countryId}, {headers: getAuthHeaders()});
    return {city: response.data, countryId};
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const deleteCity = async (params: {cityId: string; countryId: string}): Promise<{cityId: string; countryId: string}> => {
  try {
    const {cityId, countryId} = params;
    const response = await client.delete(FUNCS.CITIES_NAV(cityId), {headers: getAuthHeaders()});
    return {cityId: response.data, countryId};
  } catch (error: any) {
    throw handleApiError(error);
  }
};
