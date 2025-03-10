import {Request, Response} from 'express';
import {getAllRoleRequests, deleteRoleRequests, patchRoleRequests} from '../services/roleService';
import UserService from '../services/userService';
import {MESSAGES, TEXT} from '../constants';
import {RoleRequestStatusEnum} from '../models/enums/RoleRequestStatusEnum';

export const getAllRoleRequestsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const RoleRequests = await getAllRoleRequests();
    res.json(RoleRequests);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: MESSAGES.UNKNOWN_ERROR});
  }
};

export const updateRoleRequestsController = async (req: Request, res: Response): Promise<void> => {
  const {id} = req.params;
  const {status, userId, requested} = req.body;

  try {
    const updateRoleRequest = await patchRoleRequests(id, status);
    if (status === RoleRequestStatusEnum.APPROVED) {
      if (userId && requested) {
        await UserService.changeUserPR(userId, requested);
      } else {
        res.status(400).json({error: MESSAGES.APPROVED_ERR_MSG});
        return;
      }
    }
    res.json(updateRoleRequest);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: MESSAGES.UNKNOWN_ERROR});
  }
};

export const deleteRoleRequestsController = async (req: Request, res: Response): Promise<void> => {
  const roleRequestId = req.params.id;
  try {
    const deleteRoleRequest = await deleteRoleRequests(roleRequestId);
    res.json(deleteRoleRequest);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: MESSAGES.UNKNOWN_ERROR});
  }
};
