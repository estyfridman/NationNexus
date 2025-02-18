import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/connectDB';
import path from 'path';
import logger from '../src/utils/logger';
import { limiter } from './utils/limiter';

import countryRoutes from './routes/countryRoute';
import cityRoutes from './routes/cityRoute';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { securityMiddlewares } from './middlewares/securityMiddleware';
import fetchAndSaveCountries from './utils/seed';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(securityMiddlewares);

dotenv.config({ path: path.resolve(__dirname, 'config/.env') });
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGO_URL || '';

app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cities', cityRoutes);

connectDB(MONGODB_URI)
  .then(async () => {
    await fetchAndSaveCountries();
  })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to database:', error);
  });
