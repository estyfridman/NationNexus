import Country from '../models/country';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/countries', async (req: Request, res: Response) => {
  try {
    const countries = await Country.find();
    console.log('countries; ', countries);
    res.json(countries);
  } catch (error) {
    (error instanceof Error) ? res.status(500).json({ error: error.message }) : res.status(500).json({ error: 'An unknown error occurred' });
  }
});

// router.get('/countries/:id', async (req: Request, res: Response) => {
//   try {
//     const country = await Country.findById(req.params.id);
//     if (!country) {
//       return res.status(404).json({ error: 'Country not found' });
//     }
//     res.json(country);
//   } catch (error: unknown) {
//     (error instanceof Error) ? res.status(500).json({ error: error.message }) : res.status(500).json({ error: 'An unknown error occurred' });
//   }
// });

// router.put('/countries/:id', async (req: Request<{ id: string }, any, any, Record<string, any>>, res: Response) => {
//   try {
//     const id = req.params.id;

//     const country = await Country.findByIdAndUpdate(id, req.body, { new: true });
//     if (!country) {
//       return res.json({ error: 'Country not found' });
//     }
//     res.json(country);
//   } catch (error) {
//     (error instanceof Error) ? res.json({ error: error.message }) : res.json({ error: 'An unknown error occurred' });
//   }
// });

// router.delete('/countries/:id', async (req, res) => {
//   try {
//     const country = await Country.findByIdAndDelete(req.params.id);
//     if (!country) {
//       return res.status(404).json({ error: 'Country not found' });
//     }
//     res.json({ message: 'Country deleted' });
//   } catch (error) {
//     (error instanceof Error) ? res.status(500).json({ error: error.message }) : res.status(500).json({ error: 'An unknown error occurred' });
//   }
// });

export default router;