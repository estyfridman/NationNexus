/// <reference path="../types/express.d.ts" />
import {MESSAGES, PATH, TEXT} from '../constants';
import {Request, Response} from 'express';
import UserService from '../services/userService';
import {RoleEnum} from '../models/enums/roleEnum';
import {PermissionEnum} from '../models/enums/permissionEnum';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getUsers();
    res.json(users);
  } catch (error) {
    error instanceof Error ? res.status(400).json({error: error.message}) : res.status(500).json({error: MESSAGES.UNKNOWN_ERROR});
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} = req.params;
    const user = await UserService.getUserById(id);
    if (!user) {
      res.status(404).json({error: MESSAGES.USER_NOT_FOUND});
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({error: MESSAGES.ERR_RETRIEVE_USER});
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileImage = req.file ? `${PATH.UPS}/${req.file.filename}` : PATH.DEFAULT_USER;

    const userData = {
      firstName: req.body.firstName as string,
      lastName: req.body.lastName as string,
      username: req.body.username as string,
      email: req.body.email as string,
      phone: req.body.phone as string,
      password: req.body.password as string,
      profileImage: profileImage,
      role: req.body.role || RoleEnum.USER,
      permission: req.body.permission || PermissionEnum.VIEW,
      createdAt: new Date(),
    };
    const {user, token} = await UserService.createUser(userData);
    res.status(201).json({
      message: MESSAGES.SUCCESS_REGIS_USER,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({error: `${MESSAGES.ERR_REGIS_USER} ${(error as Error).message}`});
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} = req.params;
    const profileImage = req.file ? `${PATH.UPS}/${req.file.filename}` : undefined;

    const updateData = {
      ...req.body,
      profileImage: profileImage ? profileImage : undefined,
    };

    const {user, token} = await UserService.updateUser(id, updateData);
    if (!user) {
      res.status(404).json({error: MESSAGES.USER_NOT_FOUND});
    }
    res.status(200).json({message: MESSAGES.SUCCESS_UPDATE_USER, user, token});
  } catch (error) {
    res.status(500).json({error: MESSAGES.ERR_UPDATE_USER});
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  if (req.user?.permissions?.includes(PermissionEnum.ADMIN) && req.user?._id !== req.params.id) {
    res.status(403).json({message: MESSAGES.NOT_AUTH});
    return;
  }
  try {
    const {id} = req.params;
    const deletedUser = await UserService.deleteUser(id);
    if (!deletedUser) {
      res.status(404).json({error: MESSAGES.USER_NOT_FOUND});
    }

    res.status(200).json({
      message: MESSAGES.SUCCESS_DELETE_USER,
      deletedUserId: deletedUser._id,
    });
  } catch (error) {
    res.status(500).json({error: MESSAGES.ERR_DELETE_USER});
  }
};

export const changeUserPR = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {permission} = req.body;

    const updatedUser = await UserService.changeUserPR(id, permission);
    res.status(200).json({message: MESSAGES.SUCCESS_UPDATE_ROLE, user: updatedUser});
  } catch (error) {
    res.status(500).json({error: MESSAGES.ERR_UPDATE_ROLE});
  }
};

export const requestPRChange = async (req: Request, res: Response) => {
  try {
    const {permission, userId} = req.body;
    if (!Object.values(PermissionEnum).includes(permission)) {
      res.status(400).json({error: 'Invalid permission type'});
      return;
    }
    //permission as PermissionEnum
    const result = await UserService.requestPermissionChange(permission as PermissionEnum, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error: MESSAGES.ERR_REQ_ROLE});
  }
};
