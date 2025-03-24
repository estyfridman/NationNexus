import bcrypt from 'bcryptjs';
import User from '../models/mongooseSchemas/userSchema';
import {Types} from 'mongoose';
import {IUser} from '../models/interfaces/iUser';
import jwt from 'jsonwebtoken';
import {PermissionEnum} from '../models/enums/permissionEnum';
import PermissionRequest from '../models/mongooseSchemas/requestSchema';
import {MESSAGES, JWT_SECRET, MSG_FUNC} from '../constants';
import {validateObjectId} from '../utils/validateObjectId';

class UserService {
  async getUsers() {
    try {
      return await User.find({}, '-password');
    } catch {
      throw new Error(MESSAGES.FAILED_GET_USERS);
    }
  }

  async getUserById(id: string) {
    validateObjectId(id);

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
    validateObjectId(id);

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
    validateObjectId(id);

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
    validateObjectId(id);

    if (!Object.values(PermissionEnum).includes(permission)) {
      throw new Error(MESSAGES.INVALID_PERMISSION);
    }

    try {
      const updateQuery = action === 'ADD' ? {$addToSet: {permissions: permission}} : {$pull: {permissions: permission}};

      const updatedUser = await User.findByIdAndUpdate(id, updateQuery, {new: true, runValidators: true});

      if (!updatedUser) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw new Error(MESSAGES.FAILED_UPDATE_USER_PERMISSIONS);
    }
  }

  async changeUserPR(id: string, permission: PermissionEnum) {
    validateObjectId(id);

    try {
      console.log('changeUserPR');
      console.log(id);
      console.log(permission);
      const updatedUser = await User.findByIdAndUpdate(id, {$addToSet: {permissions: permission}}, {new: true, runValidators: true});
      console.log(updatedUser);

      if (!updatedUser) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw new Error(MESSAGES.FAILED_UPDATE_USER_ROLE);
    }
  }

  async requestPermissionChange(requestedPermission: PermissionEnum, userId: string) {
    validateObjectId(userId);

    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      const newRequest = new PermissionRequest({userId, requested: requestedPermission});
      await newRequest.save();
      console.log('Saving request:', newRequest);

      return {message: MSG_FUNC.REQUEST_ROLE_SEND(requestedPermission.toString())};
    } catch {
      throw new Error(MESSAGES.FAILED_REQUEST_ROLE);
    }
  }
}

export default new UserService();
