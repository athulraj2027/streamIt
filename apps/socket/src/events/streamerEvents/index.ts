import { Worker } from "mediasoup/types";
import { Server, Socket } from "socket.io";
import roomEvents from "./room";
import producerEvents from "./producer";

export default function streamerEvents(
  io: Server,
  socket: Socket,
  worker: Worker
) {
  roomEvents(io, socket, worker);
  producerEvents(io, socket);
}
