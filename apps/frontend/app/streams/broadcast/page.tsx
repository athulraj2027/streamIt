"use client";
import * as mediasoupClient from "mediasoup-client";
import { StreamLayout } from "@/components/layouts/StreamLayout";
import { ChatSection } from "@/components/stream/Chat";
import { socket } from "@/lib/socket";
import { useStreamStore } from "@/store/streamStore";
import { RtpCapabilities, Transport } from "mediasoup-client/types";
import { useEffect, useRef, useState } from "react";

export interface Comment {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const stream = useStreamStore((s) => s.stream);
  const [loading, setLoading] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [comments, setComments] = useState<Comment[]>([
    { id: "1", user: "User123", message: "Great stream!", timestamp: "2m ago" },
    {
      id: "2",
      user: "Gamer456",
      message: "Love this content",
      timestamp: "5m ago",
    },
    { id: "3", user: "Viewer789", message: "Keep it up!", timestamp: "8m ago" },
  ]);

  const sendTransportRef = useRef<Transport | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const createDevice = async (rtp: RtpCapabilities) => {
    const device = new mediasoupClient.Device();
    console.log("New device created : ", device);
    await device.load({ routerRtpCapabilities: rtp });
    return device;
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

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

  useEffect(() => {
    socket.emit(
      "create-stream",
      { stream },
      async (rtpCapabilities: RtpCapabilities) => {
        const device = await createDevice(rtpCapabilities);
        socket.emit(
          "create-transport",
          {
            recv: false,
            streamId: stream?.id,
            isStreamer: true,
            userId: stream?.creatorId,
          },
          async (params: any) => {
            try {
              const transport = device.createSendTransport(params);

              transport.on("connect", async ({ dtlsParameters }, cb) => {
                socket.emit(
                  "connect-transport",
                  {
                    transportId: transport.id,
                    dtlsParameters,
                    streamId: stream?.id,
                    isStreamer: true,
                    userId: stream?.creatorId,
                  },
                  () => {
                    console.log("Server confirmed the connection.");
                    cb();
                  }
                );
              });

              transport.on("produce", ({ kind, rtpParameters }, cb) => {
                socket.emit(
                  "produce",
                  {
                    streamId: stream?.id,
                    transportId: transport.id,
                    kind,
                    rtpParameters,
                    userId: stream?.creatorId,
                  },
                  ({ id }) => cb({ id })
                );
              });
              sendTransportRef.current = transport;
              console.log("Transport created  :", sendTransportRef.current.id);
              setLoading(false);

              const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              });

              const videoTrack = mediaStream.getVideoTracks()[0];
              const audioTrack = mediaStream.getAudioTracks()[0];

              console.log("Media stream tracks:", mediaStream.getTracks());
              console.log(
                "Video track enabled:",
                mediaStream.getVideoTracks()[0]?.enabled
              );

              setLocalStream(mediaStream);

              console.log(
                "Stream and isStreaming set, video ref:",
                localVideoRef.current
              );

              await sendTransportRef.current?.produce({
                track: videoTrack,
              });
              await sendTransportRef.current?.produce({
                track: audioTrack,
              });
            } catch (error) {
              console.error("Error making transport:", error);
              setLoading(false);
            }
          }
        );
      }
    );
  }, [stream]);

  const onSendMessage = () => {};

  return (
    <div className="min-h-screen bg-[#FAF3E1] pt-20">
      <StreamLayout
        leftSidebar={
          <div className="bg-white w-full h-full rounded-md py-6 px-3 text-sm">
            <h1 className="text-blue-600 font-bold text-xl mb-4">
              Stream Details
            </h1>
            <p>
              Connection Status: {isConnected ? "connected" : "disconnected"}
            </p>
            <p>Transport Used: {transport}</p>
            <p>
              LocalStream Availablitiy :{" "}
              {localStream ? "Available" : "Not Available"}
            </p>
          </div>
        }
        mainContent={
          localStream ? (
            <video
              ref={localVideoRef}
              className="w-full h-auto rounded-md object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="w-full h-full min-h-[400px] rounded-md bg-gray-800 flex items-center justify-center text-white">
              Loading camera...
            </div>
          )
        }
        rightSidebar={
          <ChatSection onSendMessage={onSendMessage} comments={comments} />
        }
      />
    </div>
  );
}
