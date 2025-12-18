"use client";
import { getChannels } from "@/actions/stream";
import { StreamLayout } from "@/components/layouts/StreamLayout";
import { ChannelList } from "@/components/stream/ChannelList";

import { socket } from "@/lib/socket";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createDevice } from "@/actions/mediasoup";

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

const WatchStreamPage = () => {
  const params = useParams();
  const router = useRouter();
  const streamId = params.id as string;

  const [channels, setChannels] = useState<Channel[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsData = await getChannels();
        setChannels(channelsData);
      } catch (error) {
        console.error("Failed to load channels:", error);
      }
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    // TODO: Connect to stream and consume media
    // This is where you'd implement the viewer-side WebRTC logic
    // socket.emit("join-stream", { streamId });
    // socket.on("consume", async (data) => { ... });
  }, [streamId]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [remoteStream]);

  const handleChannelSelect = (channelId: string) => {
    router.push(`/streams/${channelId}`);
  };

  const handleGoBack = () => {
    router.push("/streams");
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message via socket
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const selectedChannel = channels.find((c) => c.id === streamId) || null;

  return (
    <div className="min-h-screen bg-[#FAF3E1] pt-20">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <StreamLayout
          isStreaming={false}
          leftSidebar={
            <ChannelList
              channels={channels}
              selectedChannel={streamId}
              onChannelSelect={handleChannelSelect}
            />
          }
          mainContent={<div></div>}
          rightSidebar={
            <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-[#222222]/10 overflow-hidden flex flex-col lg:h-full">
              <div className="bg-[#FF6D1F] px-4 py-3">
                <h2 className="text-white font-bold text-lg">Live Chat</h2>
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
                    <div
                      key={comment.id}
                      className="bg-[#FAF3E1] rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-[#222222] text-sm">
                          {comment.user}
                        </span>
                        <span className="text-xs text-[#222222]/50">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-[#222222] text-sm">
                        {comment.message}
                      </p>
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
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Send a message..."
                    className="flex-1 px-3 py-2 border border-[#222222]/20 rounded-lg focus:outline-none focus:border-[#FF6D1F] text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-[#FF6D1F] hover:bg-[#e55f18] text-white px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default WatchStreamPage;
