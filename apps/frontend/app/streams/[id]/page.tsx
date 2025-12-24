"use client";
import { getChannels } from "@/actions/stream";
import { ChannelList } from "@/components/stream/ChannelList";

import { socket } from "@/lib/socket";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createDevice } from "@/actions/mediasoup";
import { Consumer, RtpCapabilities, Transport } from "mediasoup-client/types";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

export interface Channel {
  id: string;
  name: string;
  viewers: number;
  live: boolean;
}

export interface Comment {
  id: string;
  username: string;
  streamId: string;
  message: string;
  timestamp: string;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const WatchStreamPage = () => {
  const params = useParams();
  const router = useRouter();
  const streamId = params.id as string;
  const { user } = useAuth();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const recvTransportRef = useRef<Transport | null>(null);
  const consumerRef = useRef<Consumer[]>([]);
  const joinedRef = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const cleanupClient = () => {
    consumerRef.current.forEach((c) => c.close());
    // consumerRef.current.clear();

    recvTransportRef.current?.close();
    recvTransportRef.current = null;

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupClient();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

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
    if (!streamId || !user?.id || joinedRef.current) return;
    joinedRef.current = true;

    socket.emit(
      "join-stream",
      { streamId, userId: user?.id, username: user.name },
      async (rtp: RtpCapabilities | { error: string }) => {
        console.log("user ; ", user);
        if (!rtp || "error" in rtp) {
          toast.error("Failed to join stream");
          return;
        }

        const device = await createDevice(rtp);
        console.log("new device created : ", device);

        socket.emit(
          "create-transport",
          {
            recv: true,
            streamId,
            isStreamer: false,
            userId: user?.id,
          },
          async (params: any) => {
            if (!params || params.error) {
              toast.error("Failed to create transport");
              return;
            }

            try {
              const transport = device.createRecvTransport(params);
              console.log("recv transport created  : ", transport);

              transport.on(
                "connect",
                async ({ dtlsParameters }, callback, errback) => {
                  console.log("🔌 Connect event fired - sending DTLS");
                  console.log("dtls received : ", dtlsParameters);

                  try {
                    socket.emit(
                      "connect-transport",
                      {
                        transportId: transport.id,
                        dtlsParameters,
                        streamId,
                        isStreamer: false,
                        userId: user?.id,
                      },
                      (response: any) => {
                        console.log(
                          "✅ Server response after connecting :",
                          response
                        );

                        if (response?.connected) {
                          callback(); // Tell transport connection succeeded
                        } else {
                          const error = new Error("Connection failed");
                          errback(error);
                        }
                      }
                    );
                  } catch (error) {
                    console.error("❌ Connect error:", error);
                    errback(error as Error);
                  }
                }
              );

              transport.on("connectionstatechange", (state) => {
                console.log(`🔄 Transport state changed: ${state}`);

                if (state === "connected") {
                  console.log("✅ Transport fully connected!");
                  toast.success("Connected to stream");
                } else if (state === "failed") {
                  console.error("❌ Transport failed");
                  toast.error("Connection failed");
                }
              });

              // transport created, now we need to create media consumption

              recvTransportRef.current = transport;
              console.log("✅ Transport created:", transport.id);

              socket.emit(
                "get-producers",
                { streamId },
                async (producerIds: string[]) => {
                  if (!producerIds || producerIds.length === 0) {
                    toast.error("No stream available");
                    return;
                  }

                  console.log("📺 Producer IDs:", producerIds);

                  const { rtpCapabilities } = device;

                  producerIds.forEach((producerId) => {
                    socket.emit(
                      "consume",
                      {
                        producerId,
                        transportId: transport.id,
                        rtpCapabilities,
                        streamId,
                        userId: user.id,
                      },
                      async (response: any) => {
                        if (!response || response.error) {
                          console.error("❌ Consume failed:", response);
                          return;
                        }

                        console.log(
                          "callback for consume working, the response received : ",
                          response
                        );

                        const {
                          id,
                          producerId: pid,
                          kind,
                          rtpParameters,
                        } = response;

                        try {
                          const consumer = await transport.consume({
                            id,
                            producerId: pid,
                            kind,
                            rtpParameters,
                          });

                          consumerRef.current.push(consumer);

                          if (!consumer) {
                            console.error("❌ Consumer creation failed");
                            return;
                          }

                          console.log(`✅ ${kind} consumer created`);

                          // Resume consumer
                          socket.emit("resume-consumer", {
                            streamId,
                            consumerId: consumer.id,
                            userId: user.id,
                          });

                          if (!videoRef.current) {
                            console.error("❌ videoRef is null!");
                            return;
                          }
                          let stream = videoRef.current
                            .srcObject as MediaStream | null;

                          if (!stream) {
                            console.log("🎬 Creating new MediaStream");
                            stream = new MediaStream();
                            videoRef.current.srcObject = stream;
                          }

                          stream.addTrack(consumer.track);

                          console.log(
                            `✅ Track added: ${consumer.kind}`,
                            consumer.track.readyState,
                            consumer.track.muted
                          );
                          if (stream.getTracks().length === 2) {
                            console.log("🎬 Both tracks ready!");

                            // videoRef.current.muted = true;
                            videoRef.current
                              .play()
                              .then(() => {
                                console.log("✅ Playing!");
                                toast.success("Stream connected");
                              })
                              .catch((err) => {
                                console.error("Play error:", err);
                              });
                          }
                        } catch (error) {
                          console.error(`❌ Error consuming ${kind}:`, error);
                        }
                      }
                    );
                  });
                }
              );
            } catch (error) {
              console.error("❌ Transport creation error:", error);
              toast.error("Failed to connect");
            }
          }
        );
      }
    );
  }, [streamId, user]);

  useEffect(() => {
    const handleNewMessage = (msg: Comment) => {
      console.log("new message received : ", msg);
      setComments((prev) => [...prev, msg]);
    };

    socket.on("new-message", handleNewMessage);
    socket.on("stream-ended", () => {
      toast.success("The stream has ended ");
      router.push("/streams");
    });

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [router]);

  const handleChannelSelect = (channelId: string) => {
    router.push(`/streams/${channelId}`);
  };

  const handleGoBack = () => {
    consumerRef.current.forEach((c) => c.close());
    recvTransportRef.current?.close();
    recvTransportRef.current = null;

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    socket.emit(
      "leave-stream",
      {
        streamId,
        userId: user?.id,
        username: user?.name,
      },
      (response: any) => {
        if (!response.success) {
          toast.error(response.error);
        }
        toast.success("Left the stream successfully");
        router.push("/streams");
      }
    );
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const comment = {
        message,
        username: user?.name,
        streamId,
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

  return (
    <div className="h-screen bg-[#FAF3E1] pt-20">
      <div className="max-w-[1600px] h-full mx-auto px-4 py-6 flex flex-wrap justify-between">
        <div
          className="w-full md:w-[60%]  rounded-md"
          style={{ height: "600px" }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            controls
            className="w-full  h-full object-contain rounded-md"
            style={{ backgroundColor: "black" }}
          />
        </div>
        <div className="w-full lg:w-80 md:w-[30%] bg-white rounded-lg shadow-sm border border-[#222222]/10 overflow-hidden flex flex-col lg:h-full">
          <div className="bg-[#FF6D1F] px-4 py-3">
            <h2 className="text-white font-bold text-lg">Live Chat</h2>
          </div>

          <div className="flex-1  lg:overflow-y-auto max-h-80 lg:max-h-none overflow-y-auto p-4 space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#222222]/40 text-sm">
                  Messages sent before you joined are not accessible.Start with
                  a hi
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-lg p-3 ${
                    comment.username === user?.name
                      ? "bg-red-500 text-white"
                      : "bg-[#FAF3E1] text-[#222222]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold text-[#222222] text-sm">
                      {comment.username === user?.name
                        ? "You"
                        : comment.username}
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
              <br />
            </div>
            <button
              onClick={handleGoBack}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all mt-4"
            >
              Leave stream
            </button>
          </div>
        </div>
        <ChannelList
          channels={channels}
          selectedChannel={streamId}
          onChannelSelect={handleChannelSelect}
        />{" "}
      </div>
    </div>
  );
};

export default WatchStreamPage;
