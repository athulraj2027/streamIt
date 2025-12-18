import { Server, Socket } from "socket.io";
import consumerEvents from "./consumer";
import roomEvents from "./room";

export default function viewerEvents(io: Server, socket: Socket) {
  consumerEvents(io, socket);
  roomEvents(io, socket);
}
