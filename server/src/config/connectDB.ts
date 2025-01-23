import mongoose from 'mongoose';

let connection: mongoose.Mongoose | null = null;

async function connectDB(db: string): Promise<mongoose.Mongoose> {
  if (connection) return connection;

  try {
    connection = await mongoose.connect(db || '');
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
}

export default connectDB;