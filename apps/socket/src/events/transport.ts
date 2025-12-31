import { Server, Socket } from "socket.io";
import { findTransport, StreamMap } from "../store/stream";
import { createTransport } from "../mediasoup/transport";

export default function transportEvents(
  io: Server,
  socket: Socket,
  ip: string
) {
  socket.on(
    "create-transport",
    async ({ recv, streamId, isStreamer, userId }, cb) => {
      try {
        const stream = StreamMap.get(streamId);
        if (!stream) {
          cb({ error: "Stream not found" });
          return;
        }
        const transportParams = await createTransport(
          recv,
          socket,
          stream,
          isStreamer,
          userId,
          ip
        );
        cb(transportParams);
      } catch (error) {
        console.log("Error in creating transport :", error);
        cb({ error: "Failed to create transport" });
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
        console.log("dtls parameters received ; ", dtlsParameters);
        if (!stream) throw new Error("Stream not found");
        console.log("Stream found : ", stream);

        const transport = findTransport(
          stream,
          isStreamer,
          userId,
          socket.id,
          transportId
        );
        if (!transport) {
          console.log("No transport found ");
          throw new Error("No transport found");
        }

        await transport.connect({ dtlsParameters });

        console.log("Transport connected : ", transport);

        cb({ connected: true });
      } catch (error) {
        console.error("connect-transport failed:", error);
        cb({ error: "Failed to connect transport" });
      }
    }
  );
}
