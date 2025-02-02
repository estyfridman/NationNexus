import { Router } from 'express';
import { 
  getAllCountries, 
  getCountryById, 
  createCountry,
  updateCountry, 
  deleteCountry 
} from '../controllers/countryController';

const router = Router();

router.get('/', getAllCountries);
router.get('/:id', getCountryById);
router.post('/', createCountry); 
router.patch('/:id', updateCountry);
router.delete('/:id', deleteCountry);

export default router;