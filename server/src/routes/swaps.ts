import express, { Request, Response } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import SwapRequest from '../models/SwapRequest';

const router = express.Router();

// Create a new swap request
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, skillOffered, skillWanted, message, aiMatchScore } = req.body;
    
    const request = await SwapRequest.create({
      requester: req.user._id,
      receiver: receiverId,
      skillOffered,
      skillWanted,
      message,
      aiMatchScore
    });
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating swap request' });
  }
});

// Get user's swap requests
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const requests = await SwapRequest.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }]
    }).populate('requester receiver', 'name avatar skillsOffered skillsWanted');
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching swap requests' });
  }
});

// Accept/Reject request
router.put('/:id/status', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const request = await SwapRequest.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    await request.save();
    
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating swap request' });
  }
});

export default router;
