"use client";

import { useState } from "react";
import { Message, ChatResponse } from "@/types/chat";
import AIChatHistory from "./AIChatHistory";
import AIChatInput from "./AIChatInput";
import { RiRobot2Fill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image";

const LoadingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3 bg-gray-800/50 rounded-lg">
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
  </div>
);

export default function AIChatInterface() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI financial advisor. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);

      // Add user message to chat
      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);

      // Add temporary loading message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", isLoading: true },
      ]);

      // Send to API
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          messages: messages, // Send full message history for context
        }),
      });

      // Remove loading message and add real response
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      if (!data || !data.response) {
        throw new Error("Invalid response from API");
      }

      // Add AI response to chat
      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
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

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
      <div className="flex items-center gap-2 p-4 border-b border-cyan-500/30 bg-gray-900/50">
        <RiRobot2Fill className="text-cyan-400 text-xl" />
        <h2 className="text-cyan-400 font-semibold">
          FinAI-Your Financial Advisor
        </h2>
        <span className="ml-auto flex items-center gap-1">
          <span className="text-cyan-400 text-sm">powered by</span>
          <a
            href="https://groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/images/groq.png"
              alt="Groq Logo"
              width={35}
              height={10}
              className="object-contain hover:opacity-80 transition-opacity mt-0.5"
            />
          </a>
        </span>
      </div>
      <AIChatHistory
        messages={messages}
        aiIcon={<RiRobot2Fill className="text-cyan-400 text-xl" />}
        userIcon={<FaUser className="text-cyan-400 text-xl" />}
        userName={session?.user?.name || "User"}
        LoadingIndicator={LoadingDots}
      />
      <AIChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
