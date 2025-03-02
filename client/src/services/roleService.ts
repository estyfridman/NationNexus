import logger from '../utils/logger';
import {client} from '../api/client';
import {getAuthHeaders} from '../utils/getAuthorization';
import IRoleRequest from '../models/interfaces/iRoleRequests';
import {RoleEnum} from '../models/enums/RoleEnum';

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

export const updateRequestStatus = async ({requestId, status, userId, role}: {requestId: string; status: string; userId: string; role: RoleEnum}) => {
  try {
    const response = await client.patch(`/permissions/${requestId}`, {status, userId, role}, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(`Error updating request status: ${error}`);
    throw error;
  }
};
