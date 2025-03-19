import express from 'express';
import {getAllUsers, getUserById, registerUser, updateUser, deleteUser, changeUserPR} from '../controllers/userController';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import upload from '../services/multerService';
import {PermissionEnum} from '../models/enums/permissionEnum';

const router = express.Router();

router.post('/register', upload.single('profileImage'), registerUser);

router.use(verifyToken);
router.get('/', authorize([PermissionEnum.ADMIN]), getAllUsers);
router.get('/:id', authorize([PermissionEnum.ADMIN]), getUserById);
router.patch('/:id', authorize([PermissionEnum.ADMIN]), updateUser);
router.patch('/changeUserPR/:id', authorize([PermissionEnum.ADMIN]), changeUserPR);
router.patch('/change-permission/:id', authorize([PermissionEnum.ADMIN]), changeUserPR);
router.delete('/:id', authorize([PermissionEnum.ADMIN]), deleteUser);

export default router;
