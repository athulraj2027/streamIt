import { Server, Socket } from "socket.io";
import { createProducer } from "../../mediasoup/producer";

export default function producerEvents(io: Server, socket: Socket) {
  socket.on(
    "produce",
    async ({ streamId, transportId, kind, rtpParameters, userId }, cb) => {
      try {
        const producerId = await createProducer({
          streamId,
          socket,
          userId,
          transportId,
          kind,
          rtpParameters,
        });

        cb({ id: producerId });
      } catch (error) {
        console.error("produce error:", error);
        cb({ error: "Failed to produce" });
      }
    }
  );
}
