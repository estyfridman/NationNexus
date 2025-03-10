import express from 'express';
import {getAllUsers, getUserById, registerUser, updateUser, deleteUser, changeUserPR} from '../controllers/userController';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import upload from '../services/multerService';

const router = express.Router();

router.get('/', verifyToken, authorize(['admin']), getAllUsers);
router.get('/:id', verifyToken, authorize(['admin', 'user']), getUserById);
router.post('/register', upload.single('profileImage'), registerUser);
router.patch('/:id', verifyToken, authorize(['admin', 'user']), updateUser);
router.patch('/changeUserPR/:id', verifyToken, authorize(['admin']), changeUserPR);
router.patch('/change-permission/:id', verifyToken, authorize(['admin']), changeUserPR);
router.delete('/:id', verifyToken, authorize(['admin', 'user']), deleteUser);

export default router;
