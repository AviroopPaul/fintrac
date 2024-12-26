import { Message } from "@/types/chat";

interface AIChatHistoryProps {
  messages: Message[];
}

export default function AIChatHistory({ messages }: AIChatHistoryProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans">
              {message.content}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}
