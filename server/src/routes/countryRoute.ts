import {Router} from 'express';
import {getAllCountries, getCountryById, createCountry, updateCountry, deleteCountry} from '../controllers/countryController';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import {PermissionEnum} from '../models/enums/permissionEnum';

const router = Router();

router.get('/', getAllCountries);
router.get('/:id', getCountryById);

router.use(verifyToken);
router.post('/', authorize([PermissionEnum.ADD, PermissionEnum.ADMIN]), createCountry);
router.patch('/:id', authorize([PermissionEnum.EDIT, PermissionEnum.ADMIN]), updateCountry);
router.delete('/:id', authorize([PermissionEnum.DELETE, PermissionEnum.ADMIN]), deleteCountry);

export default router;
