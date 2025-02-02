import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/connectDB';
import path from 'path';

import countryRoutes from './routes/countryRoute';
import userRoutes from './routes/userRoutes';
import { securityMiddlewares } from './middlewares/securityMiddleware';
import fetchAndSaveCountries from './utils/seed';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/uploads", express.static("uploads"));
app.use(securityMiddlewares);

dotenv.config({ path: path.resolve(__dirname, 'config/.env') });
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGO_URL || '';

app.use('/api/countries', countryRoutes);
app.use('/api/users', userRoutes);

connectDB(MONGODB_URI)
 .then(async () => {
    await fetchAndSaveCountries();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });


