import { Request, Response } from 'express';
import { generateSkillMatchScore, generateCareerRoadmap, generateChatResponse, generateDraftRequest, optimizeProfileBio, generateTrendingSkills, generateRatingSummary } from '../services/aiService';

export const getMatchScore = async (req: Request, res: Response) => {
  try {
    const { user1Skills, user2Skills } = req.body;
    
    if (!user1Skills || !user2Skills) {
      return res.status(400).json({ message: 'Skills are required for both users' });
    }

    const result = await generateSkillMatchScore(user1Skills, user2Skills);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error generating match score' });
  }
};

export const getCareerRoadmap = async (req: Request, res: Response) => {
  try {
    const { currentSkills, targetRole } = req.body;
    
    if (!currentSkills || !targetRole) {
      return res.status(400).json({ message: 'Current skills and target role are required' });
    }

    const result = await generateCareerRoadmap(currentSkills, targetRole);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error generating roadmap' });
  }
};

export const chat = async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const reply = await generateChatResponse(message, context);
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating chat response' });
  }
};

export const draftSwapRequest = async (req: Request, res: Response) => {
  try {
    const { senderName, senderSkills, receiverName, receiverSkills } = req.body;
    
    if (!senderName || !receiverName) {
      return res.status(400).json({ message: 'Sender and receiver names are required' });
    }

    const draft = await generateDraftRequest(senderName, senderSkills || [], receiverName, receiverSkills || []);
    res.status(200).json({ draft });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating draft' });
  }
};

export const optimizeProfile = async (req: Request, res: Response) => {
  try {
    const { bio, skillsOffered, skillsWanted } = req.body;
    
    if (bio === undefined) {
      return res.status(400).json({ message: 'Bio is required' });
    }

    const optimizedBio = await optimizeProfileBio(bio, skillsOffered || [], skillsWanted || []);
    res.status(200).json({ optimizedBio });
  } catch (error) {
    res.status(500).json({ message: 'Server error optimizing profile' });
  }
};

export const getTrendingSkills = async (req: Request, res: Response) => {
  try {
    const skills = await generateTrendingSkills();
    res.status(200).json({ skills });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching trending skills' });
  }
};

export const getRatingSummary = async (req: Request, res: Response) => {
  try {
    const { reviews } = req.body;
    
    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ message: 'Reviews array is required' });
    }

    const summary = await generateRatingSummary(reviews);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating rating summary' });
  }
};
