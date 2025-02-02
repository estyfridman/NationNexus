import { Request, Response } from "express";
import { createUser } from "../services/userService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userData = {
      ...req.body,
      profileImage: req.file ? req.file.filename : null,
    };

    const newUser = await createUser(userData);
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};
