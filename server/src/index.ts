import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import countryRoutes from './routes/countryRoute';
import cors from 'cors';
import connectDB from './config/connectDB';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use('/api', countryRoutes);

dotenv.config();

const MONGODB_URI = process.env.MONGO_URL || ' ';
const PORT = process.env.PORT || 8080;

connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  }
);