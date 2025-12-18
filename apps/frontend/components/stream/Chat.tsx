import { useState } from "react";
import { Button } from "../ui/button";
export interface Channel {
  id: string;
  name: string;
  viewers: number;
  live: boolean;
}

export interface Comment {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

export const ChatSection: React.FC<{
  comments: Comment[];
  onSendMessage?: (message: string) => void;
}> = ({ comments, onSendMessage }) => {
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
        <h2 className="text-white font-bold text-lg">Live Chat</h2>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#222222]/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-[#FF6D1F] rounded-full animate-pulse"></div>
            <span className="text-[#FF6D1F] font-semibold text-sm">LIVE</span>
          </div>
          <div className="bg-[#FAF3E1] rounded-lg p-3">
            <h4 className="text-[#222222] font-semibold text-sm mb-1"></h4>
            <p className="text-[#222222]/70 text-xs"></p>
          </div>
        </div>

        <div className="flex-1 lg:overflow-y-auto max-h-80 lg:max-h-none overflow-y-auto p-4 space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#222222]/40 text-sm">
                No messages yet. Be the first to say hi! 👋
              </p>
            </div>
          ) : (
            comments.map((comment) => (
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
            ))
          )}
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
              disabled={!message.trim()}
              className="bg-[#FF6D1F] hover:bg-[#e55f18] text-white px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </Button>
          </div>

          <Button
            // onClick={}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition mt-3"
          >
            Stop Streaming
          </Button>
        </div>
      </div>
    </div>
  );
};
