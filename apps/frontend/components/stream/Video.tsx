export interface Channel {
  id: string;
  name: string;
  viewers: number;
  live: boolean;
}

interface VideoPlayerProps {
  selectedChannel: Channel | null;
  onGoBack?: () => void;
  showBackButton?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  selectedChannel,
  onGoBack,
  showBackButton = false,
}) => {
  return (
    <div className="flex-1 bg-[#222222] rounded-lg shadow-sm overflow-hidden flex flex-col lg:h-full">
      <div className="flex-1 lg:min-h-0 aspect-video lg:aspect-auto flex items-center justify-center">
        {selectedChannel ? (
          <div className="w-full h-full bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6D1F] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <p className="text-[#F5E7C6] text-lg">Stream is playing...</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <svg
              className="w-20 h-20 text-[#F5E7C6]/30 mx-auto mb-4"
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
            <p className="text-[#F5E7C6] lg:text-lg text-sm">
              Select a channel{" "}
              <span className="lg:inline hidden">to watch</span>
              <span className="lg:hidden">below to watch</span>
            </p>
          </div>
        )}
      </div>

      {selectedChannel && (
        <div className="bg-[#222222]/90 px-4 py-3 border-t border-[#F5E7C6]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && onGoBack && (
                <button
                  onClick={onGoBack}
                  className="text-[#F5E7C6] hover:text-[#FF6D1F] transition"
                  aria-label="Go back"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              <h3 className="text-[#F5E7C6] font-semibold lg:text-base text-sm">
                {selectedChannel.name}
              </h3>
            </div>
            <button className="lg:px-3 lg:py-1 px-3 py-1.5 bg-[#FF6D1F] hover:bg-[#e55f18] text-white rounded lg:text-sm text-xs transition">
              Full Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
