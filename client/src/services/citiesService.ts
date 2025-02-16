import { client } from '../api/client';
import ICity, { ICityUpdate } from '../models/interfaces/iCity';
import { handleApiError } from '../utils/error-handler';

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

export const updateCity = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: ICityUpdate;
}): Promise<{ id: string; updatedData: ICityUpdate }> => {
  try {
    const response = await client.patch(`/cities/${id}`, updatedData);
    return { id, updatedData: response.data };
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const createCity = async (city: ICity): Promise<ICity> => {
  try {
    const response = await client.post(`/cities`, city);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const deleteCity = async (id: string): Promise<ICity> => {
  try {
    const response = await client.delete(`/cities/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};
