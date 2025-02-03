import mongoose from 'mongoose';
import logger from "../utils/logger";

let connection: mongoose.Mongoose | null = null;

async function connectDB(db: string): Promise<mongoose.Mongoose> {
  if (connection) return connection;

  try {
    connection = await mongoose.connect(db || '');
    return connection;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
}

export default connectDB;