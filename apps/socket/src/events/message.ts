import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";

export default function messageEvents(io: Server, socket: Socket) {
  socket.on("send-message", ({ comment }, cb) => {
    console.log("comment received : ", comment);
    const { message, streamId } = comment;
    if (!message?.trim()) {
      return cb?.({ success: false });
    }
    comment.id = randomUUID();
    comment.timestamp = new Date().toISOString();

    io.to(streamId).emit("new-message", comment);
    console.log("message sent : ", comment);

    cb?.({ success: true });
  });
}
