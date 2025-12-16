import { Worker } from "mediasoup/types";
import { Server, Socket } from "socket.io";
import createRouter from "../mediasoup/router";
import { StreamerState, StreamMap, StreamState } from "../store/stream";

export default function roomEvents(io: Server, socket: Socket, worker: Worker) {
  socket.on("create-stream", async ({ stream }, cb) => {
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
    cb(router.rtpCapabilities);
  });

  socket.on("end-stream", async () => {});

  socket.on("leave-stream", async () => {});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}
