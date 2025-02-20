import logger from '../utils/logger';
import { client } from '../api/client';
import { getAuthHeaders } from '../utils/getAuthorization';
import IRoleRequest from '../models/interfaces/iRoleRequests';

export const getAllRoleRequests = async () => {
  try {
    const response = await client.get<IRoleRequest[]>('/permissions', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    logger.error(`Error in getAllRoleRequests: ${error}`);
    throw error;
  }
};
