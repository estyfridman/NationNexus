import bcrypt from 'bcryptjs';
import User from '../models/mongooseSchemas/userSchema';
import {Types} from 'mongoose';
import {IUser} from '../models/interfaces/iUser';
import jwt from 'jsonwebtoken';
import {IPermissionRequest} from '../models/interfaces/IPermissionRequest';
import {RoleEnum} from '../../../shared/enums';
import RoleRequest from '../models/mongooseSchemas/requestSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'hsjf38fks';

class UserService {
  async getUsers() {
    try {
      return await User.find().select('-password');
    } catch {
      throw new Error('Failed to get users');
    }
  }

  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      const user = await User.findById(id).select('-password');
      return user;
    } catch {
      throw new Error('Failed to get user by id');
    }
  }

  async createUser(userData: IUser) {
    if (!userData.firstName || !userData.username || !userData.email || !userData.password) {
      throw new Error('Missing required fields');
    }
    try {
      const existingUser = await User.findOne({username: userData.username});
      if (existingUser) {
        throw new Error('Username already exists');
      }
      const existingEmail = await User.findOne({email: userData.email});
      if (existingEmail) {
        throw new Error('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new User({
        ...userData,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({userId: newUser._id, role: newUser.role}, JWT_SECRET, {
        expiresIn: '10d',
      });
      return {user: newUser, token};
    } catch {
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: string, updateData: Partial<IUser>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!updatedUser) {
        throw new Error('User not found');
      }
      const token = jwt.sign({userId: updatedUser._id, role: updatedUser.role}, JWT_SECRET, {
        expiresIn: '10d',
      });

      return {user: updatedUser, token};
    } catch {
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      const deletedUser = await User.findByIdAndDelete(id).select('-password');
      if (!deletedUser) {
        throw new Error('User not found');
      }
      return deletedUser;
    } catch {
      throw new Error('Failed to delete user');
    }
  }

  async changeUserRole(id: string, role: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(id, {role: role.toLowerCase()}, {new: true, runValidators: true});
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user role');
    }
  }

  async requestRoleChange(userId: string, requestedRole: RoleEnum) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid ID format');
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const newRequest = new RoleRequest({userId, requestedRole});
      await newRequest.save();
      return {message: `Request for role change to ${requestedRole} has been sent for approval.`};
    } catch {
      throw new Error('Failed to request role change');
    }
  }
}

export default new UserService();
