import mongoose from 'mongoose';
import PermissionRequest from '../models/mongooseSchemas/requestSchema';
import {getAllPermissionRequests, deletePermissionRequests, patchPermissionRequests} from '../services/permissionService';
import {MESSAGES, MSG_FUNC, PR} from '../constants';
import {RoleRequestStatusEnum} from '../models/enums/RoleRequestStatusEnum';

jest.mock('../models/mongooseSchemas/requestSchema');

describe('PermissionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPermissionRequests', () => {
    it('should return all permission requests with populated user data', async () => {
      (PermissionRequest.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue([PR]),
      });

      const result = await getAllPermissionRequests();
      expect(result).toEqual([PR]);
    });

    it('should throw an error if fetching permission requests fails', async () => {
      (PermissionRequest.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error()),
      });

      await expect(getAllPermissionRequests()).rejects.toThrow(MESSAGES.PERMISSION_GET_FAILED);
    });
  });

  describe('deletePermissionRequests', () => {
    it('should delete a permission request and return it', async () => {
      const mockRequest = {_id: '507f1f77bcf86cd799439011', status: RoleRequestStatusEnum.PENDING};

      (PermissionRequest.findByIdAndDelete as jest.Mock).mockResolvedValue(mockRequest);

      const result = await deletePermissionRequests(mockRequest._id);
      expect(result).toEqual(mockRequest);
    });

    it('should throw an error if ID is invalid', async () => {
      await expect(deletePermissionRequests('invalid')).rejects.toThrow(MESSAGES.INVALID_ID);
    });

    it('should throw an error if the request is not found', async () => {
      (PermissionRequest.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(deletePermissionRequests(new mongoose.Types.ObjectId().toString())).rejects.toThrow(MESSAGES.PERMISSION_DELETE_FAILED);
    });

    it('should throw an error if deletion fails', async () => {
      (PermissionRequest.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error());

      await expect(deletePermissionRequests(new mongoose.Types.ObjectId().toString())).rejects.toThrow(MESSAGES.PERMISSION_DELETE_FAILED);
    });
  });

  describe('patchPermissionRequests', () => {
    it('should update the status of a permission request', async () => {
      const mockRequest = {_id: '507f1f77bcf86cd799439011', status: RoleRequestStatusEnum.APPROVED};

      (PermissionRequest.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockRequest);

      const result = await patchPermissionRequests(mockRequest._id, RoleRequestStatusEnum.APPROVED);
      expect(result).toEqual(mockRequest);
    });

    it('should throw an error if ID is invalid', async () => {
      await expect(patchPermissionRequests('invalid', RoleRequestStatusEnum.APPROVED)).rejects.toThrow(MESSAGES.INVALID_ID);
    });

    it('should throw an error if the request is not found', async () => {
      (PermissionRequest.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(patchPermissionRequests(new mongoose.Types.ObjectId().toString(), RoleRequestStatusEnum.APPROVED)).rejects.toThrow(
        MESSAGES.PERMISSION_NOT_FOUND
      );
    });

    it('should throw an error if update fails', async () => {
      (PermissionRequest.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(patchPermissionRequests(new mongoose.Types.ObjectId().toString(), RoleRequestStatusEnum.APPROVED)).rejects.toThrow(
        MSG_FUNC.PERMISSION_UPDATE_FAILED('Database error')
      );
    });
  });
});
