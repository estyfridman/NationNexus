import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserService from '../services/userService';
import User from '../models/mongooseSchemas/userSchema';
import {MESSAGES, MOCK_USERS, MOCK_USERS_WOPASS, MOCK_USER, MOCK_USER_WITHOUT_PASSWORD} from '../constants';
import {PermissionEnum} from '../models/enums/permissionEnum';
import {RoleEnum} from '../models/enums/roleEnum';

jest.mock('../models/mongooseSchemas/userSchema');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users excluding passwords', async () => {
      (User.find as jest.Mock).mockResolvedValue(MOCK_USERS_WOPASS);

      const users = await UserService.getUsers();
      const expectedUsers = MOCK_USERS.map(({password, ...user}) => user);
      expect(users).toEqual(expectedUsers);
    });

    it('should throw an error if fetching users fails', async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error()), await expect(UserService.getUsers()).rejects.toThrow(MESSAGES.FAILED_GET_USERS);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(MOCK_USER_WITHOUT_PASSWORD),
      }));

      const user = await UserService.getUserById('507f1f77bcf86cd799439011');
      expect(user).toEqual(MOCK_USER_WITHOUT_PASSWORD);
    });

    it('should throw an error for invalid ID', async () => {
      await expect(UserService.getUserById('invalid')).rejects.toThrow(MESSAGES.INVALID_ID);
    });

    it('should throw an error if fetching user fails', async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error()),
      });

      await expect(UserService.getUserById(new mongoose.Types.ObjectId().toString())).rejects.toThrow(MESSAGES.FAILED_GET_USER);
    });
  });

  describe('createUser', () => {
    jest.mock('bcryptjs', () => ({
      hash: jest.fn(),
      compare: jest.fn(),
    }));

    it('should create a new user and return user with token', async () => {
      const mockUserData = {
        firstName: 'Test',
        lastName: 'Test',
        username: 'testuser',
        email: 'test@mail.com',
        phone: '34534545',
        password: 'password123',
        profileImage: '/uploads/profile.jpg',
        role: RoleEnum.ADMIN,
        permissions: [PermissionEnum.EDIT, PermissionEnum.DELETE],
        createdAt: new Date(),
      };
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        ...mockUserData,
        password: 'hashedPassword',
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockImplementation(() => Promise.resolve('hashedPassword'));
      (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockImplementation(() => 'mockToken');

      const result = await UserService.createUser(mockUserData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'mockToken');
    });

    it('should throw an error if a required field is missing', async () => {
      await expect(UserService.createUser({username: 'test'} as any)).rejects.toThrow(MESSAGES.MISS_FIELDS);
    });

    it('should throw an error if username already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(MOCK_USERS[0]);
      await expect(UserService.createUser(MOCK_USER)).rejects.toThrow(MESSAGES.FAILED_CREATE_USER);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return updated user with token', async () => {
      const updateData = {firstName: 'UpdatedName'};
      const userId = '507f1f77bcf86cd799439011';

      (User.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({
          ...MOCK_USER_WITHOUT_PASSWORD,
          ...updateData,
        }),
      }));

      (jwt.sign as jest.Mock).mockImplementation(() => 'mockToken');
      const result = await UserService.updateUser(userId, updateData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'mockToken');
    });

    it('should throw an error if user ID is invalid', async () => {
      await expect(UserService.updateUser('invalid', {})).rejects.toThrow(MESSAGES.INVALID_ID);
    });

    it('should throw an error if user is not found', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      await expect(UserService.updateUser(new mongoose.Types.ObjectId().toString(), {})).rejects.toThrow(MESSAGES.FAILED_UPDATE_USER);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return deleted user', async () => {
      const userId = '507f1f77bcf86cd799439011';

      (User.findByIdAndDelete as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(MOCK_USER_WITHOUT_PASSWORD),
      }));

      const result = await UserService.deleteUser(userId);
      expect(result).toEqual(MOCK_USER_WITHOUT_PASSWORD);
    });

    it('should throw an error if user is not found', async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(UserService.deleteUser(new mongoose.Types.ObjectId().toString())).rejects.toThrow(MESSAGES.FAILED_DELETE_USER);
    });
  });

  describe('changeUserPermissions', () => {
    it('should update user permissions', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const mockUser = {_id: userId, permissions: [PermissionEnum.VIEW]};

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.changeUserPermissions(userId, PermissionEnum.EDIT, 'ADD');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if permission is invalid', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      await expect(UserService.changeUserPermissions(userId, 'INVALID' as PermissionEnum, 'ADD')).rejects.toThrow(MESSAGES.INVALID_PERMISSION);
    });
  });
});
