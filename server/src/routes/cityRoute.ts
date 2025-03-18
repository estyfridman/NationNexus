import {Router} from 'express';
import {getAllCities, getCityById, getCitiesByCountryId, createCity, updateCity, deleteCity} from '../controllers/cityController';
import {verifyToken, authorize} from '../middlewares/authMiddleware';
import {PermissionEnum} from '../models/enums/permissionEnum';

const router = Router();

router.get('/', getAllCities);
router.get('/:id', getCityById);
router.get('/by-country/:countryId', getCitiesByCountryId); // for many to many relations
router.post('/', verifyToken, authorize([PermissionEnum.ADD, PermissionEnum.ADMIN]), createCity);
router.patch('/:id', verifyToken, authorize([PermissionEnum.EDIT, PermissionEnum.ADMIN]), updateCity);
router.delete('/:id', verifyToken, authorize([PermissionEnum.DELETE, PermissionEnum.ADMIN]), deleteCity);

export default router;
