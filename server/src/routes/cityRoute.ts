import { Router } from 'express';
import {
  getAllCities,
  getCityById,
  getCitiesByCountryId,
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController';

const router = Router();

router.get('/', getAllCities);
router.get('/:id', getCityById);
router.get('/by-country/:countryId', getCitiesByCountryId); // for many to many relations
router.post('/', createCity);
router.patch('/:id', updateCity);
router.delete('/:id', deleteCity);

export default router;
