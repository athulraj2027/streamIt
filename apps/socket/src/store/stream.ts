import { Consumer, Producer, Router, WebRtcTransport } from "mediasoup/types";
export interface ViewerState {
  userId: string;

  sockets: Map<
    string, // socketId
    {
      transports: Map<string, WebRtcTransport>;
      consumers: Map<string, Consumer>;
    }
  >;
}

export interface StreamerState {
  userId: string;

  sockets: Map<
    string, // socketId
    {
      transports: Map<string, WebRtcTransport>;
      producers: Map<string, Producer>;
    }
  >;
}

export interface StreamState {
  router: Router;
  streamer: StreamerState;
  viewers: Map<string, ViewerState>; // key = viewerSocketId
}

export const StreamMap = new Map<string, StreamState>();

export function storeStreamerTransport(
  stream: StreamState,
  userId: string,
  socketId: string,
  transport: WebRtcTransport
) {
  const streamer = stream.streamer;

  let socketState = streamer.sockets.get(socketId);

  if (!socketState) {
    socketState = {
      transports: new Map(),
      producers: new Map(),
    };
    streamer.sockets.set(socketId, socketState);
  }

  socketState.transports.set(transport.id, transport);
}

export function storeViewerTransport(
  stream: StreamState,
  userId: string,
  socketId: string,
  transport: WebRtcTransport
) {
  let viewer = stream.viewers.get(userId);

  if (!viewer) {
    viewer = {
      userId,
      sockets: new Map(),
    };
    stream.viewers.set(userId, viewer);
  }

  let socketState = viewer.sockets.get(socketId);

  if (!socketState) {
    socketState = {
      transports: new Map(),
      consumers: new Map(),
    };
    viewer.sockets.set(socketId, socketState);
  }

  socketState.transports.set(transport.id, transport);
}

export function findTransport(
  stream: StreamState,
  isStreamer: boolean,
  userId: string,
  socketId: string,
  transportId: string
) {
  if (isStreamer) {
    const socketState = stream.streamer.sockets.get(socketId);
    if (!socketState) throw new Error("Streamer socket not found");

    const transport = socketState.transports.get(transportId);
    if (!transport) throw new Error("Streamer transport not found");

    return transport;
  }

  const viewer = stream.viewers.get(userId);
  if (!viewer) throw new Error("Viewer not found");

  const socketState = viewer.sockets.get(socketId);
  if (!socketState) throw new Error("Viewer socket not found");

  const transport = socketState.transports.get(transportId);
  if (!transport) throw new Error("Viewer transport not found");

  return transport;
}
