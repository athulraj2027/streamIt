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

interface StreamFormData {
  name: string;
  description: string;
}

// ChatSection Component
export const ChatSection: React.FC<{
  selectedChannel: string | null;
  comments: Comment[];
  isStreaming: boolean;
  streamName: string;
  streamDescription: string;
  loading: boolean;
  onToggleStreaming: (streamData?: StreamFormData) => void;
  onSendMessage?: (message: string) => void;
}> = ({
  selectedChannel,
  comments,
  isStreaming,
  streamName,
  streamDescription,
  onToggleStreaming,
  loading,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");
  const [formStreamName, setFormStreamName] = useState("");
  const [formStreamDescription, setFormStreamDescription] = useState("");
  const [formErrors, setFormErrors] = useState({ name: "", description: "" });

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const validateForm = () => {
    const errors = { name: "", description: "" };
    let isValid = true;

    if (!formStreamName.trim()) {
      errors.name = "Stream name is required";
      isValid = false;
    } else if (formStreamName.trim().length < 3) {
      errors.name = "Stream name must be at least 3 characters";
      isValid = false;
    }

    if (!formStreamDescription.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (formStreamDescription.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleStartStreaming = () => {
    if (validateForm()) {
      onToggleStreaming({
        name: formStreamName.trim(),
        description: formStreamDescription.trim(),
      });
    }
  };

  const handleStopStreaming = () => {
    onToggleStreaming();
    setFormStreamName("");
    setFormStreamDescription("");
    setFormErrors({ name: "", description: "" });
  };

  // Show chat if streaming or watching a channel
  const showChat = isStreaming || selectedChannel;

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-[#222222]/10 overflow-hidden flex flex-col lg:h-full">
      <div className="bg-[#FF6D1F] px-4 py-3">
        <h2 className="text-white font-bold text-lg">
          {showChat ? "Live Chat" : "Actions"}
        </h2>
      </div>

      {!showChat ? (
        <div className="flex-1 lg:flex lg:items-center lg:justify-start p-6 overflow-y-auto">
          <div className="w-full">
            {/* Stream Setup Form */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <svg
                  className="lg:w-12 lg:h-12 w-10 h-10 text-[#FF6D1F] mx-auto mb-3"
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
                <h3 className="text-[#222222] font-semibold text-lg mb-1">
                  Start Your Stream
                </h3>
                <p className="text-[#222222]/60 text-sm">
                  Fill in the details below to go live
                </p>
              </div>

              {/* Stream Name Input */}
              <div>
                <label
                  htmlFor="streamName"
                  className="block text-sm font-medium text-[#222222] mb-2"
                >
                  Stream Name <span className="text-[#FF6D1F]">*</span>
                </label>
                <input
                  id="streamName"
                  type="text"
                  value={formStreamName}
                  onChange={(e) => {
                    setFormStreamName(e.target.value);
                    if (formErrors.name)
                      setFormErrors({ ...formErrors, name: "" });
                  }}
                  placeholder="e.g., Gaming Session, Coding Tutorial"
                  className={`w-full px-3 py-2 border ${
                    formErrors.name ? "border-red-500" : "border-[#222222]/20"
                  } rounded-lg focus:outline-none focus:border-[#FF6D1F] text-sm`}
                  maxLength={50}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
                <p className="text-[#222222]/40 text-xs mt-1">
                  {formStreamName.length}/50 characters
                </p>
              </div>

              {/* Stream Description Input */}
              <div>
                <label
                  htmlFor="streamDescription"
                  className="block text-sm font-medium text-[#222222] mb-2"
                >
                  Description <span className="text-[#FF6D1F]">*</span>
                </label>
                <textarea
                  id="streamDescription"
                  value={formStreamDescription}
                  onChange={(e) => {
                    setFormStreamDescription(e.target.value);
                    if (formErrors.description)
                      setFormErrors({ ...formErrors, description: "" });
                  }}
                  placeholder="Tell viewers what your stream is about..."
                  rows={4}
                  className={`w-full px-3 py-2 border ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-[#222222]/20"
                  } rounded-lg focus:outline-none focus:border-[#FF6D1F] text-sm resize-none`}
                  maxLength={200}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.description}
                  </p>
                )}
                <p className="text-[#222222]/40 text-xs mt-1">
                  {formStreamDescription.length}/200 characters
                </p>
              </div>

              {/* Start Streaming Button */}
              <Button
                onClick={handleStartStreaming}
                disabled={loading}
                className="w-full bg-[#FF6D1F] hover:bg-[#e55f18] text-white font-semibold py-3 rounded-lg transition"
              >
                Start Streaming
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Live Chat when streaming or watching a channel
        <div className="flex-1 flex flex-col">
          {isStreaming && (
            <div className="p-4 border-b border-[#222222]/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-[#FF6D1F] rounded-full animate-pulse"></div>
                <span className="text-[#FF6D1F] font-semibold text-sm">
                  LIVE
                </span>
              </div>
              <div className="bg-[#FAF3E1] rounded-lg p-3">
                <h4 className="text-[#222222] font-semibold text-sm mb-1">
                  {streamName}
                </h4>
                <p className="text-[#222222]/70 text-xs">{streamDescription}</p>
              </div>
            </div>
          )}

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
            {isStreaming && (
              <Button
                onClick={handleStopStreaming}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition mt-3"
              >
                Stop Streaming
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
