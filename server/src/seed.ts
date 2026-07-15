import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillsphere');
    
    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const mockUsers = [
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: hashedPassword,
        bio: 'Senior Frontend Engineer at TechCorp. Love building UI animations.',
        skillsOffered: ['React', 'CSS', 'Framer Motion'],
        skillsWanted: ['Node.js', 'System Design'],
        availability: 'Weekends',
        avatar: 'https://i.pravatar.cc/150?img=47',
        xp: 1250
      },
      {
        name: 'David Kim',
        email: 'david@example.com',
        password: hashedPassword,
        bio: 'Backend Developer passionate about scalable systems and databases.',
        skillsOffered: ['Node.js', 'MongoDB', 'System Design'],
        skillsWanted: ['React', 'UI/UX'],
        availability: 'Evenings (PT)',
        avatar: 'https://i.pravatar.cc/150?img=11',
        xp: 840
      },
      {
        name: 'Elena Rodriguez',
        email: 'elena@example.com',
        password: hashedPassword,
        bio: 'Fullstack Dev navigating the startup world. I can teach you how to build an MVP fast.',
        skillsOffered: ['Next.js', 'Tailwind', 'Firebase'],
        skillsWanted: ['Docker', 'AWS'],
        availability: 'Anytime',
        avatar: 'https://i.pravatar.cc/150?img=5',
        xp: 2100
      }
    ];

    // Check if they already exist to avoid duplicates
    for (const u of mockUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Created user: ${u.name}`);
      }
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
