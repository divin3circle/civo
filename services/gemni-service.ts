import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { EmissionLog, Message } from "@/lib/constants";
import { formatLogsForContext } from "@/lib/constants";

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found in environment variables");
      throw new Error("API Key missing");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const initializeChatSession = async (
  userLogs: EmissionLog[],
  history: Message[] = []
): Promise<void> => {
  const ai = getAiClient();
  const contextString = formatLogsForContext(userLogs);

  const systemInstruction = `
    You are 'EcoCoach', a friendly, motivating, and knowledgeable AI assistant for a Carbon Tracking application.
    
    YOUR GOAL:
    Help the user understand their carbon footprint and reduce it through actionable, personalized advice.
    
    CONTEXT ACCESS:
    You have access to the user's recent activity logs below. Use this data to reference specific events when giving advice.
    If a user asks "How am I doing?", analyze the provided logs to give a summary.
    
    DATA CONTEXT:
    ${contextString}
    
    TONE:
    Encouraging, scientific but accessible, concise. Use emojis occasionally to keep it light.
    
    FORMATTING:
    Use Markdown for bolding key figures. Keep responses under 150 words unless asked for a deep dive.
  `;

  // Convert app Message type to Gemini history format
  // Note: We map 'user' -> 'user' and 'model' -> 'model' which matches Gemini API expectations
  const formattedHistory = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  try {
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory,
    });
  } catch (error) {
    console.error("Failed to initialize chat session", error);
    throw error;
  }
};

export const sendMessageToCoach = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error(
      "Chat session not initialized. Call initializeChatSession first."
    );
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message,
    });
    return (
      response.text ||
      "I'm having trouble thinking of a response right now. Try again?"
    );
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Sorry, I encountered a connection error. Please try again.";
  }
};
