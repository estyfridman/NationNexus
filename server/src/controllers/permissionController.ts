import {Request, Response} from 'express';
import {getAllPermissionRequests, deletePermissionRequests, patchPermissionRequests} from '../services/permissionService';
import UserService from '../services/userService';
import {MESSAGES, TEXT} from '../constants';
import {RoleRequestStatusEnum} from '../models/enums/RoleRequestStatusEnum';

export const getAllPermissionRequestsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const PermissionRequests = await getAllPermissionRequests();
    res.json(PermissionRequests);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: MESSAGES.UNKNOWN_ERROR});
  }
};

export const updatePermissionRequestsController = async (req: Request, res: Response): Promise<void> => {
  const {id} = req.params;
  const {status, userId, permission} = req.body;

  try {
    const updatePermissionRequest = await patchPermissionRequests(id, status);
    if (status === RoleRequestStatusEnum.APPROVED) {
      if (userId && permission) {
        await UserService.changeUserPR(userId._id, permission);
      } else {
        res.status(400).json({error: MESSAGES.APPROVED_ERR_MSG});
        return;
      }
    }
    res.json(updatePermissionRequest);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: MESSAGES.UNKNOWN_ERROR});
  }
};

export const deletePermissionRequestsController = async (req: Request, res: Response): Promise<void> => {
  const PermissionRequestId = req.params.id;
  try {
    const deletePermissionRequest = await deletePermissionRequests(PermissionRequestId);
    res.json(deletePermissionRequest);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: MESSAGES.UNKNOWN_ERROR});
  }
};
