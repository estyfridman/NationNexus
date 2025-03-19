import express from 'express';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import {requestPRChange} from '../controllers/userController';
import {getAllPermissionRequestsController, updatePermissionRequestsController} from '../controllers/permissionController';
import {PermissionEnum} from '../models/enums/permissionEnum';

const router = express.Router();

router.use(verifyToken);
router.get('/', authorize([PermissionEnum.ADMIN]), getAllPermissionRequestsController);
router.post('/request-permission', requestPRChange);
router.patch('/:id', authorize([PermissionEnum.ADMIN]), updatePermissionRequestsController);
router.get('/:id', authorize([PermissionEnum.ADMIN]), updatePermissionRequestsController);

export default router;
