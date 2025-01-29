import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import countryRoutes from './routes/countryRoute';
import authRoutes from './routes/authRoute'
import cors from 'cors';
import connectDB from './config/connectDB';
import path from 'path';
import { securityMiddlewares } from './middlewares/securityMiddleware';

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/uploads", express.static("uploads"));

app.use(securityMiddlewares); 
app.use('/api', countryRoutes);
app.use("/auth", authRoutes);

dotenv.config({ path: path.resolve(__dirname, 'config/.env') });
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