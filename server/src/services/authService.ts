import User from '../models/mongooseSchemas/userSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_SECRET, MESSAGES} from '../constants';

class AuthService {
  async loginUser(username: string, password: string) {
    if (!username || !password) {
      throw new Error(MESSAGES.USERNAME_PASSWORD_REQUIRED);
    }

    const user = await User.findOne({username});
    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    const token = jwt.sign({userId: user._id, permissions: user.permissions}, JWT_SECRET, {expiresIn: '10d'});

    return {token, user};
  }

  async authenticateUser(username: string, password: string) {
    try {
      const user = await User.findOne({username});
      if (!user) return null;

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    } catch (err) {
      throw new Error(MESSAGES.AUTHENTICATION_FAILED);
    }
  }
}

export default new AuthService();
