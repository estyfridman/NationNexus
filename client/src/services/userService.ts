import {client} from '../api/client';
import IUser from '../models/interfaces/iUser';
import logger from '../utils/logger';
import {getAuthHeaders} from '../utils/getAuthorization';
import {PermissionEnum} from '../models/enums/permissionEnum';
import {FUNCS, PATH, REGISTER_HEADER} from '../constants/constants';

export const getAllUsers = async () => {
  try {
    const response = await client.get<IUser[]>(PATH.USER_ROUTE, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_GET_USERS((error as Error).message));
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await client.get<IUser>(`${PATH.USER_ROUTE}${id}`, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_GET_USER((error as Error).message));
    throw error;
  }
};

export const registerUser = async (formData: FormData) => {
  try {
    const response = await client.post(PATH.USER_REGISTER, formData, {
      headers: REGISTER_HEADER,
    });
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_REGISTER((error as Error).message));
    throw error;
  }
};

export const loginUser = async (credentials: {username: string; password: string}) => {
  try {
    const response = await client.post(PATH.AUTH_LOGIN, credentials);
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_LOGIN((error as Error).message));
    throw error;
  }
};

export const updateUser = async ({id, formData}: {id: string; formData: FormData}) => {
  try {
    const response = await client.patch(`${PATH.USER_ROUTE}${id}`, formData, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_UPDATE_USER((error as Error).message));
    throw error;
  }
};

export const updatePermissionUser = async ({id, permission, action}: {id: string; permission: PermissionEnum; action: 'ADD' | 'REMOVE'}) => {
  try {
    const response = await client.patch(`${PATH.UPDATE_PERMISSION}${id}`, {permission, action}, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_UPDATE_PERMISSION((error as Error).message));
    throw error;
  }
};

export const requestPermission = async (permission: PermissionEnum, userId: string) => {
  try {
    const response = await client.post(PATH.REQUEST_PERMISSION, {permission, userId}, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_REQUEST_PERMISSION((error as Error).message));
    throw error;
  }
};

export const grantPermission = async ({userId, permission}: {userId: string; permission: PermissionEnum}) => {
  try {
    const response = await client.patch(`${PATH.GRANT_PERMISSION}${userId}`, {permission}, {headers: getAuthHeaders()});
    return {userId, updatedUser: response.data.user};
  } catch (error) {
    logger.error(FUNCS.ERR_GRANT_PERMISSION((error as Error).message, userId));
    throw error;
  }
};

export async function deleteUser(id: string): Promise<any> {
  try {
    const response = await client.delete(`${PATH.USER_ROUTE}${id}`, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_DELETE_USER((error as Error).message));
    throw error;
  }
}
