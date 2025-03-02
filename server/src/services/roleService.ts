import {MESSAGES, MSG_FUNC} from '../constants';
import RoleRequest from '../models/mongooseSchemas/requestSchema';
import {Types} from 'mongoose';

export async function getAllRoleRequests() {
  try {
    return await RoleRequest.find().populate({
      path: 'userId',
      select: 'username',
    });
  } catch (error) {
    throw new Error(MESSAGES.PERMISSION_GET_FAILED);
  }
}

export async function deleteRoleRequests(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(MESSAGES.INVALID_ID);
  }
  try {
    const deleteRequest = await RoleRequest.findByIdAndDelete(id);
    if (!deleteRequest) {
      throw new Error(MESSAGES.PERMISSION_NOT_FOUND);
    }
    return deleteRequest;
  } catch (error) {
    throw new Error(MESSAGES.PERMISSION_DELETE_FAILED);
  }
}

export async function patchRoleRequests(id: string, status: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(MESSAGES.INVALID_ID);
  }
  try {
    const updateRequest = await RoleRequest.findByIdAndUpdate(id, {status}, {new: true});
    if (!updateRequest) {
      throw new Error(MESSAGES.PERMISSION_NOT_FOUND);
    }
    return updateRequest;
  } catch (error) {
    throw new Error(MSG_FUNC.PERMISSION_UPDATE_FAILED((error as Error).message));
  }
}
