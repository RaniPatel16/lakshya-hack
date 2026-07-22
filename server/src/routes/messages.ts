import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import Message from '../models/Message';

const router = express.Router();

// Get historical messages for a room
router.get('/:room', protect, async (req: Request, res: Response) => {
  try {
    const { room } = req.params;
    
    // Fetch last 50 messages for the room
    const messages = await (Message as any).find({ room })
      .sort({ createdAt: 1 })
      .limit(50)
      .lean();
      
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

export default router;
