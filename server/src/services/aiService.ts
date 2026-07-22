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
export const generateDraftRequest = async (senderName: string, senderSkills: string[], receiverName: string, receiverSkills: string[]) => {
  if (!process.env.GEMINI_API_KEY) {
    return `Hi ${receiverName}, I saw you know ${receiverSkills.join(', ')}. I can teach you ${senderSkills.join(', ')}. Would you be open to a skill swap?`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write a short, friendly, and professional direct message (max 3 sentences) for a skill-swapping platform.
    The sender (${senderName}) wants to learn: ${receiverSkills.join(', ')}.
    The sender can teach: ${senderSkills.join(', ')}.
    The message is directed to ${receiverName}.
    Make it sound natural, enthusiastic, and highly likely to get a positive response.
    Do not include placeholders like [Your Name], just use the provided names.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Draft Error:", error);
    return `Hi ${receiverName}, I'm interested in swapping skills! I can teach ${senderSkills.join(', ')} if you can help me with ${receiverSkills.join(', ')}.`;
  }
};

export const optimizeProfileBio = async (currentBio: string, skillsOffered: string[], skillsWanted: string[]) => {
  if (!process.env.GEMINI_API_KEY) {
    return currentBio + " (Optimized by AI: Highly motivated learner and mentor.)";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a professional career coach and copywriter.
    Rewrite the following user bio for a skill-swapping platform.
    Current Bio: "${currentBio}"
    Skills they can teach: ${skillsOffered.join(', ')}
    Skills they want to learn: ${skillsWanted.join(', ')}
    Make the new bio sound highly professional, engaging, and attractive to potential mentors or mentees.
    Keep it concise (maximum 3 sentences). Do not use hashtags.
    Respond ONLY with the rewritten bio.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Bio Optimize Error:", error);
    return currentBio;
  }
};

export const generateTrendingSkills = async () => {
  if (!process.env.GEMINI_API_KEY) {
    return ["Generative AI", "React Server Components", "Figma Variables", "System Design", "Rust"];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `As an expert in the tech industry, list the top 5 most trending, highly-sought-after tech skills for the current year.
    Provide ONLY the 5 skill names separated by commas. No numbers, no bullet points, no extra text.
    Example: Rust, Web3, React, Generative AI, Go`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text.split(',').map(s => s.trim()).filter(Boolean);
  } catch (error) {
    console.error("AI Trending Skills Error:", error);
    return ["Generative AI", "React Server Components", "Figma Variables", "System Design", "Rust"];
  }
};

export const generateRatingSummary = async (reviews: string[]) => {
  if (!process.env.GEMINI_API_KEY || reviews.length === 0) {
    return "Consistently praised for clear communication and effective teaching methods.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an AI analyzing feedback. Summarize the following user reviews into one concise, positive, and highly professional sentence that highlights their strengths as a mentor.
    Reviews:
    ${reviews.map(r => "- " + r).join('\n')}
    
    Provide ONLY the summary sentence.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Rating Summary Error:", error);
    return "Consistently praised for clear communication and effective teaching methods.";
  }
};
