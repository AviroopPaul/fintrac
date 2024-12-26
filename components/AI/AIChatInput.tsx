import { useState } from "react";
import { IoRocketSharp } from "react-icons/io5";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function AIChatInput({
  onSendMessage,
  isLoading,
}: AIChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-cyan-500/30 p-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 bg-gray-800/50 rounded-lg px-4 py-2 text-white border border-cyan-500/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <IoRocketSharp className="text-lg" />
              <span className="sr-only">Send</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
