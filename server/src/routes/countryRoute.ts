import { Router } from 'express';
import { 
  getAllCountries, 
  getCountryById, 
  createCountry,
  updateCountry, 
  deleteCountry 
} from '../controllers/countryController';

const router = Router();

router.get('/countries', getAllCountries);
router.get('/countries/:id', getCountryById);
router.post('/countries', createCountry); 
router.patch('/countries/:id', updateCountry);
router.delete('/countries/:id', deleteCountry);

export default router;