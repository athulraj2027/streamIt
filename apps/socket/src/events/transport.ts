import { Server, Socket } from "socket.io";
import { findTransport, StreamMap } from "../store/stream";
import { createTransport } from "../mediasoup/transport";

export default function transportEvents(io: Server, socket: Socket) {
  socket.on(
    "create-transport",
    async ({ recv, streamId, isStreamer, userId }, cb) => {
      try {
        const stream = StreamMap.get(streamId);
        if (!stream) {
          return;
        }
        const transportParams = await createTransport(
          recv,
          socket,
          stream,
          isStreamer,
          userId
        );
        cb(transportParams);
      } catch (error) {
        console.log("Error in creating transport :", error);
        cb(error);
      }
    }
  );

  socket.on(
    "connect-transport",
    async (
      { streamId, transportId, dtlsParameters, isStreamer, userId },
      cb
    ) => {
      try {
        const stream = StreamMap.get(streamId);
        if (!stream) throw new Error("Stream not found");

        const transport = findTransport(
          stream,
          isStreamer,
          userId,
          socket.id,
          transportId
        );

        await transport.connect({ dtlsParameters });
        console.log("Transport connected");

        cb({ connected: true });
      } catch (error) {
        console.error("connect-transport failed:", error);
        cb({ error: "Failed to connect transport" });
      }
    }
  );
}
