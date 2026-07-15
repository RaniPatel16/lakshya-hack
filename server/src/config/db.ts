import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI as string;
    
    // Fallback to in-memory DB if no valid URI provided or if it's local
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      console.log('Starting MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
