import express from 'express';
import { getMatchScore, getCareerRoadmap, chat, draftSwapRequest, optimizeProfile, getTrendingSkills, getRatingSummary } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/match-score', protect, getMatchScore);
router.post('/roadmap', protect, getCareerRoadmap);
router.post('/chat', protect, chat);
router.post('/draft-request', protect, draftSwapRequest);
router.post('/optimize-profile', protect, optimizeProfile);
router.get('/trending-skills', protect, getTrendingSkills);
router.post('/rating-summary', protect, getRatingSummary);

export default router;
