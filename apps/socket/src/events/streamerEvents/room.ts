import { Worker } from "mediasoup/types";
import { Server, Socket } from "socket.io";

import createRouter from "../../mediasoup/router";
import { StreamerState, StreamMap, StreamState } from "../../store/stream";

export default function roomEvents(io: Server, socket: Socket, worker: Worker) {
  socket.on("create-stream", async ({ stream }, cb) => {
    try {
      const router = await createRouter(worker);
      console.log("Stream : ", stream);

      if (!StreamMap.has(stream.id)) {
        const streamerState: StreamerState = {
          userId: stream.creatorId,
          sockets: new Map([
            [
              socket.id,
              {
                transports: new Map(),
                producers: new Map(),
              },
            ],
          ]),
        };

        const streamState: StreamState = {
          router,
          streamer: streamerState,
          viewers: new Map(),
        };

        StreamMap.set(stream.id, streamState);
      }
      socket.join(stream.id);
      cb(router.rtpCapabilities);
    } catch (error) {
      console.log("error in creating stream : ", error);
      cb({ error: "Failed to create stream" });
    }
  });

  socket.on("end-stream", async ({ streamId }, cb) => {
    const stream = StreamMap.get(streamId);
    if (!stream) {
      cb({ error: "No stream found. Try again" });
      return;
    }

    console.log(`Ending stream ${streamId}`);

    stream.streamer.sockets.forEach((socketState) => {
      socketState.producers.forEach((p) => p.close());
      socketState.transports.forEach((t) => t.close());
    });

    stream.viewers.forEach((viewer) => {
      viewer.sockets.forEach((socketState) => {
        socketState.consumers.forEach((c) => c.close());
        socketState.transports.forEach((t) => t.close());
      });
    });

    stream.router.close();
    StreamMap.delete(streamId);
    io.to(streamId).emit("stream-ended", { reason: "ended-by-streamer" });
  });
}
