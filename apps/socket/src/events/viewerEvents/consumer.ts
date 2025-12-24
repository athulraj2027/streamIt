import { Server, Socket } from "socket.io";
import { findTransport, StreamMap } from "../../store/stream";

export default function consumerEvents(io: Server, socket: Socket) {
  socket.on("get-producers", async ({ streamId }, cb) => {
    const stream = StreamMap.get(streamId);
    if (!stream) {
      cb(null);
      return;
    }

    const producerIds: string[] = [];

    for (const socketState of stream.streamer.sockets.values()) {
      for (const producer of socketState.producers.values()) {
        producerIds.push(producer.id);
      }
    }

    cb(producerIds);
  });

  socket.on(
    "consume",
    async (
      { producerId, transportId, rtpCapabilities, streamId, userId },
      cb
    ) => {
      try {
        const stream = StreamMap.get(streamId);
        if (!stream) throw new Error("Stream not found");
        if (
          !stream.router.canConsume({
            producerId,
            rtpCapabilities,
          })
        ) {
          throw new Error("Cannot consume this producer");
        }
        const transport = findTransport(
          stream,
          false, // isStreamer
          userId,
          socket.id,
          transportId
        );
        //  Create consumer (paused by default)
        const consumer = await transport.consume({
          producerId,
          rtpCapabilities,
          paused: true,
        });

        console.log("consumer created : ", consumer);

        //  Store consumer in viewer socket state
        const viewer = stream.viewers.get(userId)!;
        const socketState = viewer.sockets.get(socket.id)!;
        socketState.consumers.set(consumer.id, consumer);

        //  Handle producer close
        consumer.on("producerclose", () => {
          socketState.consumers.delete(consumer.id);
          consumer.close();

          socket.emit("producer-closed", {
            producerId,
          });
        });

        //  Send consumer parameters to client
        cb({
          id: consumer.id,
          producerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        });
      } catch (err) {
        console.error("Consume error:", err);
        cb(null);
      }
    }
  );

  socket.on("resume-consumer", async ({ streamId, userId, consumerId }) => {
    try {
      const stream = StreamMap.get(streamId);
      if (!stream) throw new Error("Stream not found");

      const viewer = stream.viewers.get(userId);
      if (!viewer) throw new Error("Viewer not found");

      const socketState = viewer.sockets.get(socket.id);
      if (!socketState) throw new Error("Viewer socket state not found");

      const consumer = socketState.consumers.get(consumerId);
      if (!consumer) throw new Error("Consumer not found");

      if (!consumer.paused) {
        console.log("Consumer already resumed:", consumer.id);
        return;
      }
      await consumer?.resume();
      if (consumer.kind === "video") {
        consumer.requestKeyFrame();
        setTimeout(() => consumer.requestKeyFrame(), 300);
        setTimeout(() => consumer.requestKeyFrame(), 800);
      }

      console.log(
        `Consumer resumed | kind=${consumer?.kind} | id=${consumer.id}`
      );
    } catch (error) {
      console.error("resume-consumer error:", error);
    }
  });
}
