import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { requestRoleChange } from '../controllers/userController';
import {
  getAllRoleRequestsController,
  updateRoleRequestsController,
} from '../controllers/roleController';

const router = express.Router();

router.get('/', verifyToken, getAllRoleRequestsController);
router.post('/request-permission', verifyToken, requestRoleChange);
router.patch('/:id', verifyToken, updateRoleRequestsController);

export default router;
