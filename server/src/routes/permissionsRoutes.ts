import express from 'express';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import {requestPRChange} from '../controllers/userController';
import {getAllPermissionRequestsController, updatePermissionRequestsController} from '../controllers/permissionController';
import {PermissionEnum} from '../models/enums/permissionEnum';

const router = express.Router();

router.get('/', verifyToken, authorize([PermissionEnum.ADMIN]), getAllPermissionRequestsController);
router.post('/request-permission', verifyToken, requestPRChange);
router.patch('/:id', verifyToken, authorize([PermissionEnum.ADMIN]), updatePermissionRequestsController);
router.get('/:id', verifyToken, authorize([PermissionEnum.ADMIN]), updatePermissionRequestsController);

export default router;
