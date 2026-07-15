import express, { Request, Response } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import bcrypt from 'bcryptjs';

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

    for (const u of mockUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }
    
    res.json({ message: 'Seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed' });
  }
});

export default router;
