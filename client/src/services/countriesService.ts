import {client} from '../api/client';
import {ICountry, ICountryUpdate} from '../models/interfaces/iCountry';
import logger from '../utils/logger';
import {getAuthHeaders} from '../utils/getAuthorization';
import {PATH, ERRORS, FUNCS} from '../constants';

export async function getAllCountries(): Promise<ICountry[]> {
  try {
    const response = await client.get(PATH.COUNTRIES);
    return response.data;
  } catch (error) {
    logger.error(ERRORS.GET_ALL_COUNTRIES_ERR);
    throw error;
  }
}

export async function getCountryById(id: string): Promise<ICountry> {
  try {
    const response = await client.get(FUNCS.COUNTRY_ID(id));
    return response.data.documents;
  } catch (error) {
    logger.error(FUNCS.ERR_GET_COUNTRY((error as Error).message, id));
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
    const response = await client.patch(FUNCS.COUNTRY_ID(id), updatedData, {headers: getAuthHeaders()});
    return {id, updatedData: response.data};
  } catch (error) {
    logger.error(FUNCS.ERR_UPDATE_COUNTRY((error as Error).message, id));
    throw error;
  }
}

export async function createCountry(newCountry: ICountry): Promise<ICountry> {
  try {
    const response = await client.post(PATH.COUNTRIES, newCountry, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_CREATE_COUNTRY((error as Error).message));
    throw error;
  }
}

export async function deleteCountry(id: string): Promise<any> {
  try {
    const response = await client.delete(FUNCS.COUNTRY_ID(id), {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_DELETE_COUNTRY((error as Error).message));
    throw error;
  }
}
