import express from 'express';
import {
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  changeUserRole,
  requestRoleChange,
} from '../controllers/userController';
import upload from '../services/multerService';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/register', registerUser);
router.patch('/:id', updateUser);
router.patch('/requestRole', requestRoleChange);
router.patch('/changeUserRole', changeUserRole);
router.delete('/register', deleteUser);

export default router;
