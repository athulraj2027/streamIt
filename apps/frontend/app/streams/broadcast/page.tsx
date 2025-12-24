"use client";

import * as mediasoupClient from "mediasoup-client";
import { socket } from "@/lib/socket";
import { useStreamStore } from "@/store/streamStore";
import { Producer, RtpCapabilities, Transport } from "mediasoup-client/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { stopStream } from "@/actions/stream";

export interface Comment {
  id: string;
  username: string;
  streamId: string;
  message: string;
  timestamp: string;
}

export interface Viewer {
  id: string;
  username: string;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const stream = useStreamStore((s) => s.stream);
  const [loading, setLoading] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [viewers, setViewers] = useState<Viewer[]>([]);

  const sendTransportRef = useRef<Transport | null>(null);
  const startedRef = useRef<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

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
    if (!stream || startedRef.current) return;
    console.log("🎬 START STREAM EFFECT");
    console.log("user  :", user);
    startedRef.current = true;
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
              console.log("New transport created : ", transport);

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
                    userId: user?.id,
                  },
                  ({ id }) => cb({ id })
                );
              });
              sendTransportRef.current = transport;
              console.log("Transport created  :", sendTransportRef.current.id);
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
  }, [stream, user]);

  useEffect(() => {
    socket.on("user-joined", ({ viewer }) => {
      setViewerCount((prev) => prev + 1);
      setViewers((prev) => [...prev, viewer]);
      console.log("new user joined : ", viewer);
      toast.success("New user joined");
    });

    const handleNewMessage = (msg: Comment) => {
      console.log("new message received : ", msg);
      setComments((prev) => [...prev, msg]);
    };

    socket.on("user-left-stream", ({ username }) => {
      toast.warning(`${username} left the stream`);
      console.log("viewers : ", viewers);
      setViewerCount((prev) => prev - 1);
      console.log("user left : ", username);
    });
    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("user-joined");
      socket.off("new-message", handleNewMessage);
      socket.off("user-left-stream");
      sendTransportRef.current?.close();
    };
  }, []);

  const onSendMessage = () => {
    if (message.trim()) {
      const comment = {
        message,
        username: user?.name,
        streamId: stream?.id,
      };
      socket.emit(
        "send-message",
        { comment },
        (response: { success: boolean }) => {
          if (response.success) {
            console.log("message sent");
          }
        }
      );
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const onStopStreaming = async () => {
    socket.emit("end-stream", { stream }, async () => {
      // update the stream to completed, take stream data and save the stream data in db
      console.log("viewer data : ", viewers);
      const data = { viewers, stream };
      try {
        const res = await stopStream(data);

        toast.success("Stream has been marked completed");
        router.push("/streams");
      } catch (error) {
        console.log("Error in stopping stream : ", error);
        toast.error(error.message || "Failed to end the stream");
      }
    });
  };

  const toggleMic = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  const toggleCam = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    });
  };

  return (
    <div className="h-screen bg-[#FAF3E1] pt-20 md:px-4 flex gap-4 flex-wrap">
      <div className="relative w-full md:w-[50%]">
        <video
          ref={localVideoRef}
          className="w-full h-full rounded-md object-cover"
          autoPlay
          playsInline
          muted
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-4 bg-black/70 px-5 py-3 rounded-md backdrop-blur-md">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition ${
              micOn
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {micOn ? (
              <Mic className="text-white" />
            ) : (
              <MicOff className="text-white" />
            )}
          </button>

          <button
            onClick={toggleCam}
            className={`p-3 rounded-full transition ${
              camOn
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {camOn ? (
              <Video className="text-white" />
            ) : (
              <VideoOff className="text-white" />
            )}
          </button>
        </div>
      </div>
      <div className="w-full md:w-[30%] lg:w-80 h-full bg-white rounded-lg shadow-sm border border-[#222222]/10 overflow-hidden flex flex-col lg:h-full">
        <div className="bg-[#FF6D1F] px-4 py-3 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Live Chat</h2>
        </div>

        <div className="flex-1 lg:overflow-y-auto max-h-80 lg:max-h-none overflow-y-auto p-4 space-y-3">
          <h2 className="text-orange-500 font-bold text-md">
            Viewers : {viewerCount}
          </h2>
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
                className={`rounded-lg p-3 ${
                  comment.username === user?.name
                    ? "bg-blue-500 text-white"
                    : "bg-[#FAF3E1] text-[#222222]"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold text-[#222222] text-sm">
                    {comment.username === user?.name ? "You" : comment.username}
                  </span>
                  <span className="text-xs text-[#222222]/50">
                    {formatTime(comment.timestamp)}
                  </span>
                </div>
                <p className="text-[#222222] text-sm">{comment.message}</p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-[#222222]/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
              placeholder="Send a message..."
              className="flex-1 px-3 py-2 border border-[#222222]/20 rounded-lg focus:outline-none focus:border-[#FF6D1F] text-sm"
            />
            <button
              onClick={onSendMessage}
              disabled={!message.trim()}
              className="bg-[#FF6D1F] hover:bg-[#e55f18] text-white px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-white md:w-[20%] h-full rounded-xl py-6 px-5 text-sm shadow-md border border-gray-100">
        <h1 className="text-blue-600 font-bold text-2xl mb-6">
          Stream Details
        </h1>

        {/* Connection Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Connection</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isConnected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Transport */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Transport</span>
          <span className="font-medium text-gray-800">{transport}</span>
        </div>

        {/* Local Stream */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600">Local Media</span>
          <span
            className={`font-semibold ${
              localStream ? "text-green-600" : "text-red-600"
            }`}
          >
            {localStream ? "Available" : "Not Available"}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6" />

        {/* Stop Streaming Button */}
        <Button
          onClick={onStopStreaming}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all"
        >
          Stop Streaming
        </Button>
        <div className="mt-5">
          <p className="text-xs">
            <span className="text-red-600">*</span>Do not refresh the page or
            close the tab. You will be disconnected and the stream will be
            closed
          </p>
        </div>
      </div>
    </div>
  );
}
