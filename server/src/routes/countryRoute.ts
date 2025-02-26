import {Router} from 'express';
import {getAllCountries, getCountryById, createCountry, updateCountry, deleteCountry} from '../controllers/countryController';
import {verifyToken, authorize} from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllCountries);
router.get('/:id', getCountryById);
router.post('/', verifyToken, authorize(['admin', 'user']), createCountry);
router.patch('/:id', verifyToken, authorize(['admin']), updateCountry);
router.delete('/:id', verifyToken, authorize(['admin']), deleteCountry);

export default router;
