import {Router} from 'express';
import {getAllCities, getCityById, getCitiesByCountryId, createCity, updateCity, deleteCity} from '../controllers/cityController';
import {verifyToken, authorize} from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllCities);
router.get('/:id', getCityById);
router.get('/by-country/:countryId', getCitiesByCountryId); // for many to many relations
router.post('/', verifyToken, authorize(['admin', 'user']), createCity);
router.patch('/:id', verifyToken, authorize(['admin']), updateCity);
router.delete('/:id', verifyToken, authorize(['admin']), deleteCity);

export default router;
