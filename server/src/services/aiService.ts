import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateSkillMatchScore = async (user1Skills: string[], user2Skills: string[]) => {
  if (!process.env.GEMINI_API_KEY) return { score: 85, reason: "Mock Score: API Key missing" };
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Calculate a compatibility score (0-100) between two users for a skill swap.
      User 1 wants to learn: ${user1Skills.join(', ')}.
      User 2 can teach: ${user2Skills.join(', ')}.
      Respond ONLY with a JSON object in this exact format: {"score": 90, "reason": "Short reason here"}`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Skill Match Error:", error);
    return { score: 0, reason: "Failed to generate match score." };
  }
};

export const generateCareerRoadmap = async (currentSkills: string[], targetRole: string) => {
  if (!process.env.GEMINI_API_KEY) return { steps: ["Learn basics", "Build projects", "Apply for jobs"] };

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a 3-step career roadmap for a user who currently knows ${currentSkills.join(', ')} and wants to become a ${targetRole}. 
      Respond ONLY with a JSON object in this exact format: {"steps": ["Step 1 description", "Step 2 description", "Step 3 description"]}`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Roadmap Error:", error);
    return { steps: ["Error generating roadmap"] };
  }
};

export const generateChatResponse = async (userMessage: string, userContext: any = {}) => {
  if (!process.env.GEMINI_API_KEY) return "I am currently running in offline mode. Please add a Gemini API key.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are the SkillSphere AI Assistant. SkillSphere is a platform where users swap skills (e.g. I teach you React, you teach me Spanish). 
    Here is the context about the user asking you a question:
    Name: ${userContext.name || 'Unknown'}
    Skills Offered: ${userContext.skillsOffered?.join(', ') || 'None'}
    Skills Wanted: ${userContext.skillsWanted?.join(', ') || 'None'}
    
    The user is saying: "${userMessage}"
    
    Respond in a helpful, conversational, and concise way (1-3 sentences). Keep it relevant to SkillSphere.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later!";
  }
};
