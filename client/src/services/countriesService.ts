import {client} from '../api/client';
import {ICountry, ICountryUpdate} from '../models/interfaces/iCountry';
import logger from '../utils/logger';
import {getAuthHeaders} from '../utils/getAuthorization';

export async function getAllCountries(): Promise<ICountry[]> {
  try {
    const response = await client.get('/countries');
    return response.data;
  } catch (error) {
    logger.error(`Error fetching countries: ${error}`);
    throw error;
  }
}

export async function getCountryById(id: string): Promise<ICountry> {
  try {
    const response = await client.get(`/countries/${id}`);
    return response.data.documents;
  } catch (error) {
    logger.error(`Error fetching countries by ID: ${error} - ${id}`);
    throw error;
  }
}

export async function updateCountry({
  id,
  updatedData,
}: {
  id: string;
  updatedData: ICountryUpdate;
}): Promise<{id: string; updatedData: ICountryUpdate}> {
  try {
    const response = await client.patch(`/countries/${id}`, updatedData, {headers: getAuthHeaders()});
    return {id, updatedData: response.data};
  } catch (error) {
    logger.error(`Error updating the Country: ${error} - ${id}`);
    throw error;
  }
}

export async function createCountry(newCountry: ICountry): Promise<ICountry> {
  try {
    const response = await client.post('/countries', newCountry, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error creating country: ${error}`);
    throw error;
  }
}

export async function deleteCountry(id: string): Promise<any> {
  try {
    const response = await client.delete(`/countries/${id}`, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error deleting country: ${error}`);
    throw error;
  }
}
