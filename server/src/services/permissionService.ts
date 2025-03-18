import {MESSAGES, MSG_FUNC} from '../constants';
import PermissionRequest from '../models/mongooseSchemas/requestSchema';
import {Types} from 'mongoose';
import {RoleRequestStatusEnum} from '../models/enums/RoleRequestStatusEnum';

export async function getAllPermissionRequests() {
  try {
    return await PermissionRequest.find().populate({
      path: 'userId',
      select: 'username',
    });
  } catch (error) {
    throw new Error(MESSAGES.PERMISSION_GET_FAILED);
  }
}

export async function deletePermissionRequests(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(MESSAGES.INVALID_ID);
  }
  try {
    const deleteRequest = await PermissionRequest.findByIdAndDelete(id);
    if (!deleteRequest) {
      throw new Error(MESSAGES.PERMISSION_NOT_FOUND);
    }
    return deleteRequest;
  } catch (error) {
    throw new Error(MESSAGES.PERMISSION_DELETE_FAILED);
  }
}

export async function patchPermissionRequests(id: string, status: RoleRequestStatusEnum) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(MESSAGES.INVALID_ID);
  }
  try {
    const updateRequest = await PermissionRequest.findByIdAndUpdate(id, {status}, {new: true});
    if (!updateRequest) {
      throw new Error(MESSAGES.PERMISSION_NOT_FOUND);
    }
    return updateRequest;
  } catch (error) {
    throw new Error(MSG_FUNC.PERMISSION_UPDATE_FAILED((error as Error).message));
  }
}
