import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface Comment {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

interface ChatSectionProps {
  selectedChannel: string | null;
  comments: Comment[];
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onSendMessage?: (message: string) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  selectedChannel,
  comments,
  isStreaming,
  onToggleStreaming,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-[#222222]/10 overflow-hidden flex flex-col lg:h-full">
      <div className="bg-[#FF6D1F] px-4 py-3">
        <h2 className="text-white font-bold text-lg">
          {selectedChannel ? "Live Chat" : "Actions"}
        </h2>
      </div>

      {!selectedChannel ? (
        <div className="flex-1 lg:flex lg:items-center lg:justify-center p-6">
          <div className="text-center w-full">
            <svg
              className="lg:w-16 lg:h-16 w-12 h-12 text-[#FF6D1F] mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <Button
              onClick={onToggleStreaming}
              className="w-full bg-[#FF6D1F] hover:bg-[#e55f18] text-white font-semibold py-3 rounded-lg transition"
            >
              {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </Button>
            {isStreaming && (
              <p className="text-[#222222]/60 text-sm mt-3">
                Your stream is now live!
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 lg:overflow-y-auto max-h-80 lg:max-h-none overflow-y-auto p-4 space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-[#FAF3E1] rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold text-[#222222] text-sm">
                    {comment.user}
                  </span>
                  <span className="text-xs text-[#222222]/50">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-[#222222] text-sm">{comment.message}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#222222]/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Send a message..."
                className="flex-1 px-3 py-2 border border-[#222222]/20 rounded-lg focus:outline-none focus:border-[#FF6D1F] text-sm"
              />
              <Button
                onClick={handleSend}
                className="bg-[#FF6D1F] hover:bg-[#e55f18] text-white px-4 rounded-lg transition"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
