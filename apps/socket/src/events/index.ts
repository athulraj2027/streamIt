import { Server, Socket } from "socket.io";
import roomEvents from "./room";
import { Worker } from "mediasoup/types";
import transportEvents from "./transport";
import producerEvents from "./producer";

export default function events(io: Server, socket: Socket, worker: Worker) {
  roomEvents(io, socket, worker);
  transportEvents(io, socket);
  producerEvents(io, socket);
}
