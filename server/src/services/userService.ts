import bcrypt from 'bcryptjs';
import User from '../models/mongooseSchemas/userSchema';
import {Types} from 'mongoose';
import {IUser} from '../models/interfaces/iUser';
import jwt from 'jsonwebtoken';
import {PermissionEnum} from '../models/enums/permissionEnum';
import PermissionRequest from '../models/mongooseSchemas/requestSchema';
import {MESSAGES, JWT_SECRET, MSG_FUNC} from '../constants';

class UserService {
  async getUsers() {
    try {
      return await User.find().select('-password');
    } catch {
      throw new Error(MESSAGES.FAILED_GET_USERS);
    }
  }

  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
    }
    try {
      const user = await User.findById(id).select('-password');
      return user;
    } catch {
      throw new Error(MESSAGES.FAILED_GET_USER);
    }
  }

  async createUser(userData: IUser) {
    if (!userData.firstName || !userData.username || !userData.email || !userData.password) {
      throw new Error(MESSAGES.MISS_FIELDS);
    }
    try {
      const existingUser = await User.findOne({username: userData.username});
      if (existingUser) {
        throw new Error(MESSAGES.USERNAME_EXISTS);
      }
      const existingEmail = await User.findOne({email: userData.email});
      if (existingEmail) {
        throw new Error(MESSAGES.EMAIL_EXISTS);
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
      throw new Error(MESSAGES.FAILED_CREATE_USER);
    }
  }

  async updateUser(id: string, updateData: Partial<IUser>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
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
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      const token = jwt.sign({userId: updatedUser._id, role: updatedUser.role}, JWT_SECRET, {
        expiresIn: '10d',
      });

      return {user: updatedUser, token};
    } catch {
      throw new Error(MESSAGES.FAILED_UPDATE_USER);
    }
  }

  async deleteUser(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
    }
    try {
      const deletedUser = await User.findByIdAndDelete(id).select('-password');
      if (!deletedUser) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      return deletedUser;
    } catch {
      throw new Error(MESSAGES.FAILED_DELETE_USER);
    }
  }
  async changeUserPermissions(id: string, permission: PermissionEnum, action: 'ADD' | 'REMOVE') {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
    }

    const validPermissions = Object.values(PermissionEnum);
    if (!validPermissions.includes(permission)) {
      throw new Error(MESSAGES.INVALID_PERMISSION);
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      let updatedPermissions = user.permissions || [];
      if (action === 'ADD' && !updatedPermissions.includes(permission)) {
        updatedPermissions.push(permission);
      } else if (action === 'REMOVE') {
        updatedPermissions = updatedPermissions.filter((perm) => perm !== permission);
      }
      console.log(updatedPermissions);

      const updatedUser = await User.findByIdAndUpdate(id, {permissions: updatedPermissions}, {new: true, runValidators: true});

      return updatedUser;
    } catch (error) {
      throw new Error(MESSAGES.FAILED_UPDATE_USER_PERMISSIONS);
    }
  }

  async changeUserPR(id: string, role: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(id, {role: role.toLowerCase()}, {new: true, runValidators: true});
      if (!updatedUser) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw new Error(MESSAGES.FAILED_UPDATE_USER_ROLE);
    }
  }

  async requestPermissionChange(requestedPermission: PermissionEnum, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error(MESSAGES.INVALID_ID);
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      const newRequest = new PermissionRequest({userId, requested: requestedPermission});
      await newRequest.save();
      return {message: MSG_FUNC.REQUEST_ROLE_SEND(requestedPermission.toString())};
    } catch {
      throw new Error(MESSAGES.FAILED_REQUEST_ROLE);
    }
  }
}

export default new UserService();
