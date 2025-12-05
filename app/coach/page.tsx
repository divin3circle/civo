"use client";
import React, { useState, useEffect, useRef } from "react";
import { EmissionLog, Message } from "@/lib/constants";
import { mockEmissionLogs } from "@/lib/mock";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  Building2,
  DollarSign,
  Target,
  Plus,
  Clock,
  ArrowUp,
} from "lucide-react";

interface ChatInterfaceProps {
  logs: EmissionLog[];
}

const LOCAL_STORAGE_KEY = "ecoTrack_chat_history";

const ChatInterface: React.FC<ChatInterfaceProps> = ({ logs }) => {
  // Initialize state from localStorage (only on client-side)
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep a ref of messages to access the latest state in effects without unnecessary dependencies
  const messagesRef = useRef(messages);

  // Load messages from localStorage on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse chat history from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      try {
        // Initialize chat session via API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "initialize",
            logs,
            history: messagesRef.current,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Check if it's a rate limit error
          if (response.status === 429 || data.isRateLimit) {
            throw new Error(
              data.error ||
                "Rate limit exceeded. Please check your API quota and try again later."
            );
          }
          throw new Error(data.error || "Failed to initialize chat session");
        }

        // Only add initial greeting if history is empty
        if (messagesRef.current.length === 0) {
          setMessages([
            {
              id: "init-1",
              role: "model",
              text: "Hi! I'm your EcoCoach. I've analyzed your recent carbon logs. How can I help you reduce your footprint today?",
              timestamp: Date.now(),
            },
          ]);
        }
      } catch (e) {
        console.error("Chat init failed", e);
        if (messagesRef.current.length === 0) {
          const errorMessage =
            e instanceof Error
              ? e.message
              : "I'm having trouble connecting to the service. Please check your API key.";
          setMessages([
            {
              id: "error-1",
              role: "model",
              text: errorMessage,
              timestamp: Date.now(),
            },
          ]);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    if (logs.length > 0) {
      init();
    }
  }, [logs]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");

    // Optimistic UI update
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send",
          message: userText,
          logs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a rate limit error
        if (response.status === 429 || data.isRateLimit) {
          throw new Error(
            data.error || "Rate limit exceeded. Please try again later."
          );
        }
        throw new Error(data.error || "Failed to send message");
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: data.text || "Sorry, I couldn't process that. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, I couldn't process that. Please try again.";
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: errorMessage,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to clear the chat history?")
    ) {
      setMessages([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }

      // Re-initialize session with empty history
      fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "initialize",
          logs,
          history: [],
        }),
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            if (response.status === 429 || data.isRateLimit) {
              throw new Error(
                data.error || "Rate limit exceeded. Please try again later."
              );
            }
            throw new Error(data.error || "Failed to re-initialize session");
          }
          setMessages([
            {
              id: Date.now().toString(),
              role: "model",
              text: "History cleared. Starting fresh! How can I help?",
              timestamp: Date.now(),
            },
          ]);
        })
        .catch((error) => {
          console.error("Failed to re-initialize session:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to re-initialize session";
          setMessages([
            {
              id: Date.now().toString(),
              role: "model",
              text: errorMessage,
              timestamp: Date.now(),
            },
          ]);
        });
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName.split(" ")[0];
    if (user?.email) return user.email.split("@")[0];
    return "there";
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    // Auto-submit the prompt
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  if (isInitializing && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm font-medium">
            Reviewing your data...
          </p>
        </div>
      </div>
    );
  }

  // Show welcome screen when no messages
  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-7xl mx-auto w-full">
          {/* Welcome Section */}
          <div className="flex flex-col items-center gap-6 mb-12">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full border border-foreground/20 bg-background flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-foreground" />
            </div>

            {/* Greeting */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {getGreeting()}, {getUserName()}.
              </h1>
              <p className="text-muted-foreground">
                Hey there! What can I do for your carbon footprint today?
              </p>
            </div>
          </div>

          {/* Prompt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
            {/* Card 1 */}
            <div className="bg-background border border-foreground/20 rounded-3xl p-6 flex flex-col gap-4">
              <Building2 className="w-6 h-6 text-foreground" />
              <div>
                <h3 className="font-bold text-foreground mb-2">
                  How&apos;s my carbon footprint?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get a quick overview of your carbon emissions, including
                  transport, food, and energy usage.
                </p>
              </div>
              <button
                onClick={() => handlePromptClick("How's my carbon footprint?")}
                className="mt-auto bg-background border border-foreground/20 rounded-3xl px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
              >
                View Report
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-background border border-foreground/20 rounded-3xl p-6 flex flex-col gap-4">
              <DollarSign className="w-6 h-6 text-foreground" />
              <div>
                <h3 className="font-bold text-foreground mb-2">
                  How can I reduce emissions?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized advice on reducing your carbon footprint and
                  saving money on energy costs.
                </p>
              </div>
              <button
                onClick={() =>
                  handlePromptClick("How can I reduce my emissions?")
                }
                className="mt-auto bg-background border border-foreground/20 rounded-3xl px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
              >
                Analyze Options
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-background border border-foreground/20 rounded-3xl p-6 flex flex-col gap-4">
              <Target className="w-6 h-6 text-foreground" />
              <div>
                <h3 className="font-bold text-foreground mb-2">
                  What are my best practices?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Discover the most effective strategies for maintaining a
                  sustainable lifestyle based on your data.
                </p>
              </div>
              <button
                onClick={() => handlePromptClick("What are my best practices?")}
                className="mt-auto bg-background border border-foreground/20 rounded-3xl px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
              >
                View Insights
              </button>
            </div>
          </div>

          {/* Chat Input */}
          <div className="w-full max-w-3xl">
            <form
              onSubmit={handleSendMessage}
              className="relative flex items-center bg-background border border-foreground/20 rounded-3xl px-4 py-3"
            >
              <div className="flex items-center gap-3 mr-3">
                <button
                  type="button"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Clock className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Write a message here..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="ml-3 w-8 h-8 rounded-full bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:hover:bg-foreground/10 transition-colors flex items-center justify-center"
              >
                <ArrowUp className="w-4 h-4 text-foreground" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface when messages exist
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      {/* Chat Header with Clear Button */}
      <div className="border-b border-foreground/20 p-4 flex justify-end max-w-7xl mx-auto w-full shrink-0">
        <button
          onClick={handleClearHistory}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          title="Clear Chat History"
        >
          Clear History
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-4 space-y-4 max-w-7xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-foreground text-background rounded-br-none"
                  : "bg-background text-foreground border border-foreground/20 rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-wrap font-normal">{msg.text}</div>
              <div
                className={`text-[10px] mt-1 text-right opacity-70 ${
                  msg.role === "user"
                    ? "text-background/70"
                    : "text-muted-foreground"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="bg-background border border-foreground/20 rounded-3xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="shrink-0 bg-background border-t border-foreground/20 p-4">
        <form
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-2 max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-3 mr-3">
            <button
              type="button"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write a message here..."
            className="flex-1 bg-background border border-foreground/20 text-foreground placeholder:text-muted-foreground rounded-3xl pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 p-2 bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:hover:bg-foreground/10 rounded-full transition-colors"
          >
            <ArrowUp className="w-5 h-5 text-foreground" />
          </button>
        </form>
      </div>
    </div>
  );
};

// Page component that wraps ChatInterface
export default function CoachPage() {
  // For now, use mock logs. In production, fetch from API or use useEmissionLogs hook
  const logs = mockEmissionLogs;

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      <ChatInterface logs={logs} />
    </div>
  );
}
