"use client";
import { getChannels, startStream, stopStream } from "@/actions/stream";
import { StreamLayout } from "@/components/layouts/StreamLayout";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ChannelList } from "@/components/stream/ChannelList";
import { ChatSection } from "@/components/stream/Chat";
import { VideoPlayer } from "@/components/stream/Video";
import { socket } from "@/lib/socket";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/types";
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
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
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

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Clear loading state when URL params change
  useEffect(() => {
    setLoading(false);
  }, [selectedChannel, isStreaming]);

  // Find selected channel data
  const selectedChannelData =
    channels.find((c) => c.id === selectedChannel) || null;

  // Handlers
  const handleChannelSelect = (channelId: string) => {
    setLoading(true);
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
        const response = await startStream(streamData);
        const stream = response.stream;
        setStreamName(streamData.name);
        setStreamDescription(streamData.description);
        params.set("streaming", "true");
        params.delete("channel");
        socket.emit(
          "create-stream",
          { stream },
          async (rtpCapabilities: any) => {
            const device = await createDevice(rtpCapabilities);
            socket.emit(
              "create-transport",
              {
                recv: false,
                streamId: stream.id,
                isStreamer: true,
                userId: stream.creatorId,
              },
              async (params: any) => {
                try {
                  const transport = device.createSendTransport(params);
                  console.log(
                    "send transport created for streamer  :",
                    transport.id
                  );
                  transport.on(
                    "connect",
                    async ({ dtlsParameters }, cb, erback) => {
                      socket.emit(
                        "connect-transport",
                        {
                          transportId: transport.id,
                          dtlsParameters,
                          streamId: stream.id,
                          isStreamer: true,
                          userId: stream.creatorId,
                        },
                        () => {
                          console.log("Server confirmed the connection.");
                          cb();
                        }
                      );
                    }
                  );

                  transport.on("produce", ({ kind, rtpParameters }, cb) => {
                    socket.emit(
                      "produce",
                      {
                        streamId: stream.id,
                        transportId: transport.id,
                        kind,
                        rtpParameters,
                        userId: stream.creatorId,
                      },
                      ({ id }) => cb({ id })
                    );
                  });
                } catch (error) {
                  console.log("Error in creating transport : ", error);
                }
              }
            );
          }
        );
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
      setLoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    // Add your API call here to send the message
  };

  return (
    <div className="min-h-screen bg-[#FAF3E1] pt-20">
      {loading && <LoadingOverlay />}
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
