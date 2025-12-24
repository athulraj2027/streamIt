import { Socket } from "socket.io";
import {
  storeStreamerTransport,
  storeViewerTransport,
  StreamState,
} from "../store/stream";
import { WebRtcTransport } from "mediasoup/types";

export async function createTransport(
  recv: boolean,
  socket: Socket,
  stream: StreamState,
  isStreamer: boolean,
  userId: string
) {
  const router = stream.router;

  const transport: WebRtcTransport = await router.createWebRtcTransport({
    listenIps: [
      {
        ip: "0.0.0.0",
        announcedIp: process.env.ANNOUNCED_IP,
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true, 
    appData: {
      socketId: socket.id,
      recv,
    },
  });

  if (isStreamer) {
    storeStreamerTransport(stream, userId, socket.id, transport);
  } else {
    storeViewerTransport(stream, userId, socket.id, transport);
  }

  return {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  };
}
