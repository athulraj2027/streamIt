import { Server, Socket } from "socket.io";
import { StreamMap } from "../../store/stream";

export default function roomEvents(io: Server, socket: Socket) {
  socket.on("join-stream", ({ streamId, userId, username }, cb) => {
    const stream = StreamMap.get(streamId);
    if (!stream) {
      cb({ message: "No stream found" });
      return;
    }
    let viewer = stream.viewers.get(userId);
    const isNewViewer = !viewer;

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

      // ✅ FIX: Every socket joins room
      socket.join(streamId);

      // Only emit user-joined for new viewers
      if (isNewViewer) {
        const viewerCount = stream.viewers.size;
        io.to(streamId).emit("user-joined", {
          viewer: { id: userId, name: username },
        });
      }
    }

    cb(stream.router.rtpCapabilities);
  });

  socket.on("leave-stream", async ({ streamId, userId, username }, cb) => {
    const stream = StreamMap.get(streamId);
    if (!stream) return cb?.({ error: "No stream found" });

    const viewer = stream.viewers.get(userId);
    if (!viewer) return cb?.({ success: false });

    const currentSocket = viewer.sockets.get(socket.id);
    currentSocket?.consumers.forEach((c) => c.close());
    currentSocket?.transports.forEach((t) => t.close());

    viewer.sockets.delete(socket.id);

    if (viewer.sockets.size === 0) {
      stream.viewers.delete(userId);
    }

    socket.leave(streamId);
    io.to(streamId).emit("user-left-stream", { userId, username });
    cb?.({ success: true });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const [streamId, stream] of StreamMap.entries()) {
      // Check if disconnected socket is the streamer
      const streamerSocket = stream.streamer.sockets.get(socket.id);
      if (streamerSocket) {
        console.log(`Streamer disconnected from stream ${streamId}`);

        // Close all streamer resources
        streamerSocket.producers.forEach((p) => p.close());
        streamerSocket.transports.forEach((t) => t.close());
        stream.streamer.sockets.delete(socket.id);

        // If streamer has no more sockets, end the stream
        if (stream.streamer.sockets.size === 0) {
          console.log(`Stream ${streamId} ended - no more streamer sockets`);

          // Close all viewer resources
          stream.viewers.forEach((viewer) => {
            viewer.sockets.forEach((s) => {
              s.consumers.forEach((c) => c.close());
              s.transports.forEach((t) => t.close());
            });
          });

          // Close router and delete stream
          stream.router.close();
          StreamMap.delete(streamId);
          console.log(StreamMap);

          // Notify all viewers
          io.to(streamId).emit("stream-ended", {
            reason: "streamer-disconnected",
          });
        }
        return;
      }

      // Check if disconnected socket is a viewer
      for (const [userId, viewer] of stream.viewers.entries()) {
        const viewerSocket = viewer.sockets.get(socket.id);
        if (viewerSocket) {
          console.log(`Viewer ${userId} disconnected from stream ${streamId}`);

          // Close viewer resources
          viewerSocket.consumers.forEach((c) => c.close());
          viewerSocket.transports.forEach((t) => t.close());
          viewer.sockets.delete(socket.id);

          // If viewer has no more sockets, remove viewer
          if (viewer.sockets.size === 0) {
            stream.viewers.delete(userId);
            io.to(streamId).emit("viewer-left", { userId });
          }
          return;
        }
      }
    }
  });
}
