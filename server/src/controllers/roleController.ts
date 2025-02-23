import {Request, Response} from 'express';
import {getAllRoleRequests, deleteRoleRequests, patchRoleRequests} from '../services/roleService';
import UserService from '../services/userService';

export const getAllRoleRequestsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const RoleRequests = await getAllRoleRequests();
    res.json(RoleRequests);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: 'An unknown error occurred'});
  }
};

export const updateRoleRequestsController = async (req: Request, res: Response): Promise<void> => {
  const {id} = req.params;
  const {status, userId, role} = req.body;

  try {
    const updateRoleRequest = await patchRoleRequests(id, status);
    if (status === 'APPROVED') {
      if (userId && role) {
        await UserService.changeUserRole(userId, role);
      } else {
        res.status(400).json({error: 'Missing userId or role for APPROVED status.'});
        return;
      }
    }
    res.json(updateRoleRequest);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: 'An unknown error occurred'});
  }
};

export const deleteRoleRequestsController = async (req: Request, res: Response): Promise<void> => {
  const roleRequestId = req.params.id;
  try {
    const deleteRoleRequest = await deleteRoleRequests(roleRequestId);
    res.json(deleteRoleRequest);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: 'An unknown error occurred'});
  }
};
