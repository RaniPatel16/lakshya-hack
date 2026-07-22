import express, { Request, Response } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Get all users (except current logged-in user)
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .lean();
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get leaderboard (top users by XP)
router.get('/leaderboard', protect, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({})
      .select('name avatar bio level xp')
      .sort({ xp: -1 })
      .limit(10)
      .lean();
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Update user profile
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    
    if (req.body.skillsOffered) {
      user.skillsOffered = req.body.skillsOffered.split(',').map((s: string) => s.trim());
    }
    
    if (req.body.skillsWanted) {
      user.skillsWanted = req.body.skillsWanted.split(',').map((s: string) => s.trim());
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      skillsOffered: updatedUser.skillsOffered,
      skillsWanted: updatedUser.skillsWanted,
      level: updatedUser.level,
      xp: updatedUser.xp,
      token: req.headers.authorization?.split(' ')[1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Seed mock users
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    let mockUsers: any[] = [];
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate 6 realistic user profiles for a skill swapping app (like software developers, designers, language learners, etc.). 
        Respond ONLY with a JSON array of objects. Do not include markdown code block formatting.
        Each object must have these exact fields:
        "name" (First Last),
        "email" (a fake email),
        "bio" (1-2 sentences about what they do and what they want to learn),
        "skillsOffered" (array of 2-4 strings),
        "skillsWanted" (array of 2-4 strings),
        "availability" (string like 'Weekends', 'Evenings (PT)', 'Anytime', 'Mornings (EST)'),
        "xp" (integer between 100 and 3000)
        `;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }
        
        const generatedUsers = JSON.parse(responseText);
        
        mockUsers = generatedUsers.map((u: any, i: number) => ({
          ...u,
          password: hashedPassword,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
        }));
      } catch (aiError) {
        console.error("AI Generation failed for seed, falling back to static", aiError);
      }
    }

    if (mockUsers.length === 0) {
      try {
        const response = await fetch('https://randomuser.me/api/?results=10&inc=name,email,picture');
        const data = await response.json();
        
        const possibleSkills = ['React', 'Node.js', 'Python', 'UI/UX Design', 'AWS', 'Docker', 'Figma', 'System Design', 'TypeScript', 'Tailwind CSS', 'Go', 'Digital Marketing', 'Data Analysis', 'Machine Learning', 'GraphQL'];
        const getRandomSkills = () => {
          const shuffled = [...possibleSkills].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, Math.floor(Math.random() * 3) + 2); // 2 to 4 skills
        };
        const availabilities = ['Weekends', 'Evenings (PT)', 'Anytime', 'Mornings (EST)', 'Weekdays'];
        const bios = [
          'Passionate professional looking to swap skills and learn from others.',
          'Self-taught developer eager to expand my knowledge base.',
          'Love teaching what I know and absorbing new tech like a sponge.',
          'Always building side projects. Let us learn together!',
          'Industry veteran wanting to mentor and pick up modern frameworks.',
          'Looking for a study buddy to master system design and architecture.'
        ];

        mockUsers = data.results.map((u: any) => ({
          name: `${u.name.first} ${u.name.last}`,
          email: u.email,
          password: hashedPassword,
          bio: bios[Math.floor(Math.random() * bios.length)],
          skillsOffered: getRandomSkills(),
          skillsWanted: getRandomSkills(),
          availability: availabilities[Math.floor(Math.random() * availabilities.length)],
          avatar: u.picture.large,
          xp: Math.floor(Math.random() * 2000) + 500
        }));
      } catch (err) {
        console.error("Failed to fetch from randomuser.me", err);
      }
    }

    for (const u of mockUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }
    
    res.json({ message: 'Seeded successfully with ' + mockUsers.length + ' users' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Seed failed' });
  }
});

export default router;
