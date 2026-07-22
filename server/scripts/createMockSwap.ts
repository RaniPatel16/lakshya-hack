import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db';
import User from '../src/models/User';
import SwapRequest from '../src/models/SwapRequest';

dotenv.config();

const run = async () => {
  await connectDB();
  
  // Find the user (likely "rani" or the only one that isn't a mock user)
  const users = await User.find();
  const mainUser = users.find(u => !u.email.includes('example.com')); // Assuming the user didn't use example.com
  const mockUser = users.find(u => u.email.includes('example.com')); // Grab David, Sarah, or Elena

  if (!mainUser || !mockUser) {
    console.log('Could not find the main user or mock users.');
    process.exit(1);
  }

  // Create a mock pending swap from the mock user TO the main user
  // This makes it show up in the main user's "Action Required" list.
  const swap = new SwapRequest({
    requester: mockUser._id,
    receiver: mainUser._id,
    skillOffered: mockUser.skillsOffered[0] || 'React',
    skillWanted: 'JavaScript', // Something the main user might know
    message: `Hi ${mainUser.name}, I would love to learn from you!`,
    status: 'pending'
  });

  await swap.save();
  console.log(`Successfully created a pending swap request from ${mockUser.name} to ${mainUser.name}.`);
  process.exit(0);
};

run();
