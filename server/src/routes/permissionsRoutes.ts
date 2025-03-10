import express from 'express';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import {requestPRChange} from '../controllers/userController';
import {getAllRoleRequestsController, updateRoleRequestsController} from '../controllers/roleController';

const router = express.Router();

router.get('/', verifyToken, authorize(['admin']), getAllRoleRequestsController);
router.post('/request-permission', verifyToken, requestPRChange);
router.patch('/:id', verifyToken, authorize(['admin']), updateRoleRequestsController);

export default router;
