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
      cb(router.rtpCapabilities);
    } catch (error) {
      console.log("error in creating stream : ", error);
    }
  });

  socket.on("end-stream", async () => {});
}
