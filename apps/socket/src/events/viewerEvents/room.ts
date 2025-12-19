import { Server, Socket } from "socket.io";
import { StreamMap } from "../../store/stream";

export default function roomEvents(io: Server, socket: Socket) {
  socket.on("join-stream", ({ streamId, userId }, cb) => {
    const stream = StreamMap.get(streamId);
    if (!stream) {
      cb({ message: "No stream found" });
      return;
    }
    let viewer = stream.viewers.get(userId);

    if (!viewer) {
      viewer = {
        userId,
        sockets: new Map(),
      };
      stream.viewers.set(userId, viewer);
    }

    if (!viewer.sockets.has(socket.id)) {
      viewer.sockets.set(socket.id, {
        transports: new Map(),
        consumers: new Map(),
      });
    }

    cb(stream.router.rtpCapabilities);
  });

  socket.on("leave-stream", async () => {});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}
