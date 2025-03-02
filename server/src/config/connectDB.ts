import mongoose from 'mongoose';
import logger from '../utils/logger';
import {MESSAGES} from '../constants';

let connection: mongoose.Mongoose | null = null;

async function connectDB(db: string): Promise<mongoose.Mongoose> {
  if (connection) return connection;

  try {
    connection = await mongoose.connect(db || '');
    return connection;
  } catch (error) {
    logger.error(`${MESSAGES.MONGO_CONNECTION_ERR}${error}`);
    process.exit(1);
  }
}

export default connectDB;
