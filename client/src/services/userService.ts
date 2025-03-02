import {client} from '../api/client';
import IUser from '../models/interfaces/iUser';
import logger from '../utils/logger';
import {getAuthHeaders} from '../utils/getAuthorization';
import {RoleEnum} from '../models/enums/RoleEnum';

export const getAllUsers = async () => {
  try {
    const response = await client.get<IUser[]>('/users', {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error in getAllUsers: ${error}`);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await client.get<IUser>(`/users/${id}`, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error in getUserById: ${error}`);
    throw error;
  }
};

export const registerUser = async (formData: FormData) => {
  try {
    const response = await client.post('/users/register', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return response.data;
  } catch (error) {
    logger.error(`Error registering user: ${error}`);
    throw error;
  }
};

export const loginUser = async (credentials: {username: string; password: string}) => {
  try {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    logger.error(`Error logging in: ${error}`);
    throw error;
  }
};

export const updateUser = async ({id, formData}: {id: string; formData: FormData}) => {
  try {
    const response = await client.patch(`/users/${id}`, formData, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    throw error;
  }
};

export const requestPermission = async (role: RoleEnum, userId: string) => {
  try {
    const response = await client.post('/permissions/request-permission', {role, userId}, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error requesting permission: ${error}`);
    throw error;
  }
};

export const grantPermission = async ({userId, role}: {userId: string; role: RoleEnum}) => {
  try {
    const response = await client.patch(`/users/changeUserRole/${userId}`, {role}, {headers: getAuthHeaders()});
    return {userId, updatedUser: response.data.user};
  } catch (error) {
    logger.error(`Error granting permission: ${error}`);
    throw error;
  }
};

export async function deleteUser(id: string): Promise<any> {
  try {
    const response = await client.delete(`/users/${id}`, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    throw error;
  }
}
