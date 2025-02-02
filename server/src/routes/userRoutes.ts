import express from "express";
import { registerUser } from "../controllers/userController";
import upload from "../services/multerService";

const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser);

export default router;
