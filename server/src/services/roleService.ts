import { RoleEnum } from '../../../shared/enums';
import RoleRequest from '../models/mongooseSchemas/requestSchema';
import { Types } from 'mongoose';

export async function getAllRoleRequests() {
  try {
    return await RoleRequest.find().populate({
      path: 'userId',
      select: 'username',
    });
  } catch (error) {
    throw new Error('Failed to get permission requests');
  }
}

export async function deleteRoleRequests(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  try {
    const deleteRequest = await RoleRequest.findByIdAndDelete(id);
    if (!deleteRequest) {
      throw new Error('Permission request not found');
    }
    return deleteRequest;
  } catch (error) {
    throw new Error('Failed to get permission requests');
  }
}

export async function patchRoleRequests(id: string, status: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  try {
    const updateRequest = await RoleRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!updateRequest) {
      throw new Error('Permission request not found');
    }
    return updateRequest;
  } catch (error) {
    throw new Error(`Failed to update permission request: ${(error as Error).message}`);
  }
}
