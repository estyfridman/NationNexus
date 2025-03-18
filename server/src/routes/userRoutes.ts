import express from 'express';
import {getAllUsers, getUserById, registerUser, updateUser, deleteUser, changeUserPR} from '../controllers/userController';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import upload from '../services/multerService';
import {PermissionEnum} from '../models/enums/permissionEnum';

const router = express.Router();

router.get('/', verifyToken, authorize([PermissionEnum.ADMIN]), getAllUsers);
router.get('/:id', verifyToken, authorize([PermissionEnum.ADMIN]), getUserById);
router.post('/register', upload.single('profileImage'), registerUser);
router.patch('/:id', verifyToken, authorize([PermissionEnum.ADMIN]), updateUser);
router.patch('/changeUserPR/:id', verifyToken, authorize([PermissionEnum.ADMIN]), changeUserPR);
router.patch('/change-permission/:id', verifyToken, authorize([PermissionEnum.ADMIN]), changeUserPR);
router.delete('/:id', verifyToken, authorize([PermissionEnum.ADMIN]), deleteUser);

export default router;
