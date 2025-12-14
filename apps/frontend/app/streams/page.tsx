"use client";
import { StreamLayout } from "@/components/layouts/StreamLayout";
import { ChannelList } from "@/components/stream/ChannelList";
import { ChatSection } from "@/components/stream/Chat";
import { VideoPlayer } from "@/components/stream/Video";
import React, { useState } from "react";

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

const StreamsPage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Mock data for channels
  const channels: Channel[] = [
    { id: "1", name: "Gaming Zone", viewers: 1234, live: true },
    { id: "2", name: "Tech Talks", viewers: 567, live: true },
    { id: "3", name: "Music Live", viewers: 890, live: false },
    { id: "4", name: "Coding Stream", viewers: 234, live: true },
  ];

  // Mock data for comments
  const comments: Comment[] = [
    { id: "1", user: "User123", message: "Great stream!", timestamp: "2m ago" },
    {
      id: "2",
      user: "Gamer456",
      message: "Love this content",
      timestamp: "5m ago",
    },
    { id: "3", user: "Viewer789", message: "Keep it up!", timestamp: "8m ago" },
  ];

  // Find selected channel data
  const selectedChannelData =
    channels.find((c) => c.id === selectedChannel) || null;

  // Handlers
  const handleGoBack = () => setSelectedChannel(null);
  const handleToggleStreaming = () => setIsStreaming(!isStreaming);
  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    // Add your API call here to send the message
  };

  return (
    <div className="min-h-screen bg-[#FAF3E1] pt-20">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <StreamLayout
          leftSidebar={
            <ChannelList
              channels={channels}
              selectedChannel={selectedChannel}
              onChannelSelect={setSelectedChannel}
            />
          }
          mainContent={
            <VideoPlayer
              selectedChannel={selectedChannelData}
              onGoBack={handleGoBack}
              showBackButton={true}
            />
          }
          rightSidebar={
            <ChatSection
              selectedChannel={selectedChannel}
              comments={comments}
              isStreaming={isStreaming}
              onToggleStreaming={handleToggleStreaming}
              onSendMessage={handleSendMessage}
            />
          }
        />
      </div>
    </div>
  );
};

export default StreamsPage;
