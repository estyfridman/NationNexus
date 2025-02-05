import express from 'express';
import { loginUser } from '../controllers/authController';
import { verifyToken, authorize } from '../middlewares/authMiddleware';
import {
  updateUser,
  deleteUser,
  changeUserRole,
  requestRoleChange,
} from '../controllers/userController';

const router = express.Router();

router.post('/login', loginUser);
router.patch('/:id', updateUser);
router.post('/changeUserRole', changeUserRole);

export default router;
