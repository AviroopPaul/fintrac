import { Message } from "@/types/chat";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
import { Components } from "react-markdown";

interface AIChatHistoryProps {
  messages: Message[];
  aiIcon: ReactNode;
  userIcon: ReactNode;
  userName: string;
  LoadingIndicator: React.ComponentType;
}

export default function AIChatHistory({
  messages,
  aiIcon,
  userIcon,
  userName,
  LoadingIndicator,
}: AIChatHistoryProps) {
  const { data: session } = useSession();

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 sm:gap-3 ${
            message.role === "user" ? "flex-row-reverse" : ""
          }`}
        >
          <div className="flex-shrink-0">
            {message.role === "user" ? (
              session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={userName}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                />
              ) : (
                userIcon
              )
            ) : (
              aiIcon
            )}
          </div>
          <div
            className={`flex flex-col ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-xs sm:text-sm text-cyan-400 mb-1">
              {message.role === "user" ? userName : "FinAI"}
            </span>
            {message.isLoading ? (
              <LoadingIndicator />
            ) : (
              <div
                className={`rounded-lg p-2 sm:p-3 max-w-[90%] sm:max-w-[80%] text-sm sm:text-base ${
                  message.role === "user"
                    ? "bg-cyan-500/20 text-white"
                    : "bg-gray-700/50 text-gray-100"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({
                      node,
                      inline,
                      className,
                      children,
                      ...props
                    }: any) => (
                      <code
                        className={`${className} ${
                          inline
                            ? "bg-gray-800 px-1 py-0.5 rounded text-sm"
                            : "block text-sm"
                        } whitespace-pre-wrap break-words`}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                    pre: ({ node, children, ...props }) => (
                      <pre
                        className="bg-gray-800 p-2 sm:p-4 rounded-lg my-2 overflow-x-auto"
                        {...props}
                      >
                        {children}
                      </pre>
                    ),
                    table: ({ children }) => (
                      <table className="border-collapse table-auto w-full my-4">
                        {children}
                      </table>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-700">{children}</thead>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-gray-600">{children}</tr>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 px-4 py-2 text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 px-4 py-2">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
