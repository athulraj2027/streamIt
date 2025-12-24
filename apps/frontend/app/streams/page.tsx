"use client";
import { getChannels } from "@/actions/stream";
import { StreamLayout } from "@/components/layouts/StreamLayout";
import { ChannelList } from "@/components/stream/ChannelList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface Channel {
  id: string;
  name: string;
  viewers: number;
  live: boolean;
}

const StreamsPage = () => {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);

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

  const handleChannelSelect = (channelId: string) => {
    router.push(`/streams/${channelId}`);
  };

  const handleStartBroadcast = () => {
    router.push("/streams/broadcast");
  };

  return (
    <div className="h-screen bg-[#FAF3E1] pt-20 flex overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 flex flex-row gap-4 w-full h-full">
        {/* LEFT: Channel List */}
        <div className="hidden lg:block w-64 shrink-0">
          <ChannelList
            channels={channels}
            selectedChannel={null}
            onChannelSelect={handleChannelSelect}
          />
        </div>

        {/* CENTER: Hero */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <h1 className="tracking-tight text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#222222] leading-tight max-w-3xl">
            Stream Smarter.
            <span className="block text-[#FF6D1F]">Scale Faster.</span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-[#222222]/80 max-w-2xl leading-relaxed">
            Broadcast and watch high-performance live streams with sub-second
            latency, real-time messaging, and live analytics —
            <span className="text-[#FF6D1F] font-semibold">
              {" "}
              powered by Next.js, Mediasoup, WebRTC, and HLS.
            </span>
          </p>
        </div>

        {/* RIGHT: Actions */}
        <div className="hidden md:flex w-80 shrink-0 bg-white rounded-lg shadow-sm border border-[#222222]/10 flex-col">
          <div className="bg-[#FF6D1F] px-4 py-3">
            <h2 className="text-white font-bold text-lg">Actions</h2>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full text-center">
              <svg
                className="w-12 h-12 text-[#FF6D1F] mx-auto mb-4"
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

              <h3 className="text-[#222222] font-semibold text-lg mb-2">
                Ready to Go Live?
              </h3>

              <p className="text-[#222222]/60 text-sm mb-6">
                Start your own stream and connect with viewers
              </p>

              <Link href="/streams/create">
                <button
                  onClick={handleStartBroadcast}
                  className="w-full bg-[#FF6D1F] hover:bg-[#e55f18] text-white font-semibold py-3 rounded-lg transition"
                >
                  Start Broadcasting
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsPage;
