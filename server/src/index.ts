import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import countryRoutes from './routes/countryRoute';
import cors from 'cors';
import Country from './models/country';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use('/countries', countryRoutes);

dotenv.config();

const db = process.env.DB_CONNECTION_STRING || " ";

async function connect () {
  try {
    const conn = await mongoose.connect(db || '');
  } catch (error) {
    console.error(`Error: ${error}`, db);
    process.exit(1);
  }
}

connect();

app.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    console.log('countries: ', countries);
    res.json(countries);
  } catch (error) {
    (error instanceof Error) ? res.status(500).json({ error: error.message }) : res.status(500).json({ error: 'An unknown error occurred' });
  }
})

// app.delete('/countries/:id', async (req, res) => {
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

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
