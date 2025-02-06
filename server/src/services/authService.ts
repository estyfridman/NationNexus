import User from '../models/mongooseSchemas/userSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hsjf38fks';

class AuthService {
  async loginUser(username: string, password: string) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10d' });

    return { token, user };
  }

  async authenticateUser(username: string, password: string) {
    try {
      const user = await User.findOne({ username });
      if (!user) return null;

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    } catch (err) {
      throw new Error('Failed to authenticate user');
    }
  }
}

export default new AuthService();
