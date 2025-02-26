import {client} from '../api/client';
import ICity, {ICityUpdate} from '../models/interfaces/iCity';
import {handleApiError} from '../utils/error-handler';
import {getAuthHeaders} from '../utils/getAuthorization';

export async function getAllCities(): Promise<ICity[]> {
  try {
    const response = await client.get<ICity[]>('/cities');
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
}

export const getCityById = async (id: string): Promise<ICity> => {
  try {
    const response = await client.get<ICity>(`/cities/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const getCitiesByCountryId = async (countryId: string): Promise<ICity[]> => {
  try {
    const response = await client.get<ICity[]>(`/cities/by-country/${countryId}`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const updateCity = async ({updatedData}: {updatedData: ICityUpdate}): Promise<{updatedData: ICityUpdate}> => {
  try {
    const response = await client.patch(`/cities/${updatedData._id}`, updatedData, {headers: getAuthHeaders()});
    return {updatedData: response.data};
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const createCity = async (city: ICity): Promise<ICity> => {
  try {
    const response = await client.post(`/cities`, city, {headers: getAuthHeaders()});
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const deleteCity = async (id: string): Promise<ICity> => {
  try {
    const response = await client.delete(`/cities/${id}`, {headers: getAuthHeaders()});
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};
