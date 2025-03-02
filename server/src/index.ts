import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/connectDB';
import path from 'path';
import logger from '../src/utils/logger';
import {limiter} from './utils/limiter';
import countryRoutes from './routes/countryRoute';
import cityRoutes from './routes/cityRoute';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import permissionsRoutes from './routes/permissionsRoutes';
import {securityMiddlewares} from './middlewares/securityMiddleware';
import fetchAndSaveCountries from './utils/seed';
import {METHODS, ORIGIN, ALLOWED_HEADERS, PATH, MESSAGES} from './constants';
const app = express();

app.use(
  cors({
    origin: ORIGIN,
    methods: METHODS,
    allowedHeaders: ALLOWED_HEADERS,
  })
);
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(PATH.UPS, (req, res, next) => {
  res.setHeader(PATH.HEADER_NAME, PATH.HEADER_POLICY);
  next();
});
app.use(PATH.UPS, express.static(path.join(__dirname, PATH.POINTS, PATH.UP)));
app.use(securityMiddlewares);

dotenv.config({path: path.resolve(__dirname, PATH.CONFIG)});
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGO_URL || '';

app.use(PATH.AUTH_API, authRoutes);
app.use(PATH.COUNTRIES_API, countryRoutes);
app.use(PATH.USERS_API, userRoutes);
app.use(PATH.CITIES_API, cityRoutes);
app.use(PATH.PERMISSIONS_API, permissionsRoutes);

connectDB(MONGODB_URI)
  .then(async () => {
    await fetchAndSaveCountries();
  })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`${MESSAGES.RUN} ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(MESSAGES.FAILED_CONNECT, error);
  });
