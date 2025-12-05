import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Chat } from "@google/genai";
import { EmissionLog, Message, formatLogsForContext } from "@/lib/constants";

// Store chat sessions in memory (in production, consider using Redis or a database)
const chatSessions = new Map<string, Chat>();

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

// Generate a session ID from logs (or use a user ID in production)
const getSessionId = (logs: EmissionLog[]): string => {
  // In production, use actual user ID
  return `session_${logs.length > 0 ? logs[0].date : "default"}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message, logs, history } = body;

    if (action === "initialize") {
      // Initialize chat session
      const ai = getAiClient();
      const contextString = formatLogsForContext(logs || []);

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
      const formattedHistory = (history || []).map((msg: Message) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const sessionId = getSessionId(logs || []);
      const chatSession = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
        history: formattedHistory,
      });

      chatSessions.set(sessionId, chatSession);

      return NextResponse.json({ success: true, sessionId });
    } else if (action === "send") {
      // Send message to chat
      const sessionId = getSessionId(logs || []);
      const chatSession = chatSessions.get(sessionId);

      if (!chatSession) {
        return NextResponse.json(
          { error: "Chat session not initialized" },
          { status: 400 }
        );
      }

      const response = await chatSession.sendMessage({
        message,
      });

      return NextResponse.json({
        success: true,
        text:
          response.text ||
          "I'm having trouble thinking of a response right now. Try again?",
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Chat API error:", error);

    // Type guard for error with status/code properties
    interface ErrorWithStatus {
      status?: number;
      code?: number;
      error?: { code?: number };
      message?: string;
    }

    const err = error as ErrorWithStatus;

    // Check for rate limit errors (429 status code)
    const isRateLimitError =
      err?.status === 429 ||
      err?.code === 429 ||
      err?.error?.code === 429 ||
      (err?.message?.includes("quota") ?? false) ||
      (err?.message?.includes("rate limit") ?? false);

    if (isRateLimitError) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. You've exceeded your API quota. Please check your plan and billing details, or try again later.",
          code: 429,
          isRateLimit: true,
        },
        { status: 429 }
      );
    }

    // Check for other API errors
    const errorStatus = err?.status || err?.code || err?.error?.code;
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorStatus || 500,
      },
      { status: errorStatus || 500 }
    );
  }
}
