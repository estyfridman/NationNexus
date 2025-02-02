import bcrypt from "bcryptjs";
import User from "../models/mongooseSchemas/userSchema";

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string | null;
}

export const createUser = async (userData: UserData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = new User({
    ...userData,
    password: hashedPassword,
  });

  return await newUser.save();
};
