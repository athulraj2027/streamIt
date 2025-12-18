import { create } from "zustand";

export interface Stream {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  isLive: boolean;
}

interface StreamState {
  stream: Stream | null;
  setStream: (stream: Stream) => void;
  clearStream: () => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  stream: null,
  setStream: (stream) => set({ stream }),
  clearStream: () => set({ stream: null }),
}));
