import { Request, Response } from 'express';
import UserService from '../services/userService';
import { IUser } from '../models/mongooseSchemas/userSchema';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getUsers();
    res.json(users);
  } catch (error) {
    error instanceof Error
      ? res.status(400).json({ error: error.message })
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userData = {
      firstName: req.body.firstName as string,
      lastName: req.body.lastName as string,
      username: req.body.username as string,
      email: req.body.email as string,
      phone: req.body.phone as string,
      password: req.body.password as string,
      role: req.body.role || 'guest',
      createdAt: new Date(),
    };
    const newUser = await UserService.createUser(userData);
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      profileImage: req.file ? req.file.filename : undefined,
    };

    const updatedUser = await UserService.updateUser(id, updateData);
    res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await UserService.changeUserRole(id, role);
    res.status(200).json({ message: 'User role updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user role' });
  }
};

export const requestRoleChange = async (req: Request, res: Response) => {
  try {
    const { userId, requestedRole } = req.body;
    const result = await UserService.requestRoleChange(userId, requestedRole);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error requesting role change' });
  }
};
