import logger from '../utils/logger';
import {client} from '../api/client';
import {getAuthHeaders} from '../utils/getAuthorization';
import IRoleRequest from '../models/interfaces/iRoleRequests';
import {RoleRequestStatusEnum} from '../models/enums/RoleRequestStatusEnum';
import {PermissionEnum} from '../models/enums/permissionEnum';
import {PATH, FUNCS} from '../constants';

export const getAllPermissionRequests = async () => {
  try {
    const response = await client.get<IRoleRequest[]>(PATH.PERMISSIONS, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_GET_ALL_REQUEST_PERMISSIONS((error as Error).message));
    throw error;
  }
};

export const updateRequestStatus = async ({
  requestId,
  status,
  userId,
  permission,
}: {
  requestId: string;
  status: RoleRequestStatusEnum;
  userId: string;
  permission: PermissionEnum;
}) => {
  try {
    const response = await client.patch(`${PATH.PERMISSIONS}/${requestId}`, {status, userId, permission}, {headers: getAuthHeaders()});
    return response.data;
  } catch (error) {
    logger.error(FUNCS.ERR_UPDATE_REQUEST((error as Error).message));
    throw error;
  }
};
