"use client";

export interface Channel {
  id: string;
  name: string;
  viewers: number;
  live: boolean;
}

export const ChannelList: React.FC<{
  channels: Channel[];
  selectedChannel: string | null;
  onChannelSelect: (channelId: string) => void;
}> = ({ channels, selectedChannel, onChannelSelect }) => {
  return (
    <div className="bg-white h-full rounded-lg shadow-sm border border-[#222222]/10 overflow-hidden flex flex-col w-full lg:w-64 lg:h-full">
      <div className="bg-[#222222] px-4 py-3">
        <h2 className="text-[#F5E7C6] font-bold text-lg">Live Channels</h2>
      </div>

      <div className="flex-1 lg:max-h-none max-h-96 overflow-y-auto">
        {channels.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[#222222]/40 text-sm">No live streams</p>
          </div>
        ) : (
          channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onChannelSelect(channel.id)}
              className={`px-4 py-3 cursor-pointer border-b border-[#222222]/10 hover:bg-[#FAF3E1] transition ${
                selectedChannel === channel.id ? "bg-[#FAF3E1]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#222222] text-sm truncate">
                    {channel.name}
                  </h3>
                </div>
                {channel.live && (
                  <span className="ml-2 px-2 py-0.5 bg-[#FF6D1F] text-white text-xs font-semibold rounded">
                    LIVE
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
