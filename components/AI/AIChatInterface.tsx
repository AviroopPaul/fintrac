"use client";

import { useState } from "react";
import { Message, ChatResponse } from "@/types/chat";
import AIChatHistory from "./AIChatHistory";
import AIChatInput from "./AIChatInput";
import { RiRobot2Fill } from "react-icons/ri";
import { MdOutlineScience } from "react-icons/md";

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI financial advisor. I can help you analyze your spending patterns and provide personalized financial advice. What would you like to know?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);

      // Add user message to chat
      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);

      // Send to API
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          rawResponse: content.toLowerCase().includes("explain in detail"),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data: ChatResponse = await response.json();

      // Add AI response to chat - now we can use the message directly
      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

//   TODO: Add chat history with messages like CHATGPT

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
      <div className="flex items-center gap-2 p-4 border-b border-cyan-500/30 bg-gray-900/50">
        <RiRobot2Fill className="text-cyan-400 text-xl" />
        <h2 className="text-cyan-400 font-semibold">AI Financial Advisor</h2>
        <MdOutlineScience className="text-cyan-400 text-xl ml-auto" />
      </div>
      <AIChatHistory messages={messages} />
      <AIChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
