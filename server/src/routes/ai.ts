import express from 'express';
import { getMatchScore, getCareerRoadmap, chat } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/match-score', protect, getMatchScore);
router.post('/roadmap', protect, getCareerRoadmap);
router.post('/chat', protect, chat);

export default router;
