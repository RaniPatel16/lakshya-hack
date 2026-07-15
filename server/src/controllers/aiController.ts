import { Request, Response } from 'express';
import { generateSkillMatchScore, generateCareerRoadmap, generateChatResponse } from '../services/aiService';

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
