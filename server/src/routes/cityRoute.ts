import { Router } from 'express';
import {
  getAllCities,
  getCitiesByCountryId,
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController';

const router = Router();

router.get('/', getAllCities);
router.get('/:id', getCitiesByCountryId);
router.post('/', createCity);
router.patch('/:id', updateCity);
router.delete('/:id', deleteCity);

export default router;
