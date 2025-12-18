import { Server, Socket } from "socket.io";

export default function roomEvents(io: Server, socket: Socket) {
  socket.on("leave-stream", async () => {});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}
