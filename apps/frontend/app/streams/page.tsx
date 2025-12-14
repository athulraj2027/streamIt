"use client";
import { getChannels, startStream, stopStream } from "@/actions/stream";
import { StreamLayout } from "@/components/layouts/StreamLayout";
import { ChannelList } from "@/components/stream/ChannelList";
import { ChatSection } from "@/components/stream/Chat";
import { VideoPlayer } from "@/components/stream/Video";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const StreamsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [channels, setChannels] = useState<Channel[]>([]);

  // Get state from URL params
  const selectedChannel = searchParams.get("channel");
  const isStreaming = searchParams.get("streaming") === "true";

  // Keep stream details in local state
  const [streamName, setStreamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamDescription, setStreamDescription] = useState("");

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

  // Find selected channel data
  const selectedChannelData =
    channels.find((c) => c.id === selectedChannel) || null;

  // Handlers
  const handleChannelSelect = (channelId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("channel", channelId);
    params.delete("streaming");
    params.delete("streamName");
    params.delete("streamDescription");
    router.push(`?${params.toString()}`);
  };

  const handleGoBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("channel");
    router.push(`?${params.toString()}`);
  };

  const handleToggleStreaming = async (streamData?: StreamFormData) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      if (!isStreaming && streamData) {
        await startStream(streamData);
        setStreamName(streamData.name);
        setStreamDescription(streamData.description);
        params.set("streaming", "true");
        params.delete("channel");
      } else {
        // Stop streaming
        await stopStream();
        setStreamName("");
        setStreamDescription("");
        params.delete("streaming");
      }

      router.push(`?${params.toString()}`);
    } catch (error) {
      console.error("Streaming action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    // Add your API call here to send the message
  };

  return (
    <div className="min-h-screen bg-[#FAF3E1] pt-20">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <StreamLayout
          isStreaming={isStreaming}
          leftSidebar={
            <ChannelList
              channels={channels}
              selectedChannel={selectedChannel}
              onChannelSelect={handleChannelSelect}
            />
          }
          mainContent={
            <VideoPlayer
              selectedChannel={selectedChannelData}
              isStreaming={isStreaming}
              onGoBack={handleGoBack}
              showBackButton={true}
            />
          }
          rightSidebar={
            <ChatSection
              selectedChannel={selectedChannel}
              comments={comments}
              isStreaming={isStreaming}
              streamName={streamName}
              streamDescription={streamDescription}
              onToggleStreaming={handleToggleStreaming}
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          }
        />
      </div>
    </div>
  );
};

export default StreamsPage;
