import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db';
import SwapRequest from '../src/models/SwapRequest';

dotenv.config();

const run = async () => {
  await connectDB();
  
  // Find all pending swap requests and set them to accepted
  const result = await SwapRequest.updateMany(
    { status: 'pending' },
    { $set: { status: 'accepted' } }
  );
  
  console.log(`Successfully accepted ${result.modifiedCount} swap requests.`);
  process.exit(0);
};

run();
