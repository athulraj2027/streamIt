import { MediaKind, Producer } from "mediasoup/types";
import { Socket } from "socket.io";
import { StreamMap } from "../store/stream";

interface CreateProducerParams {
  streamId: string;
  socket: Socket;
  userId: string;
  transportId: string;
  kind: MediaKind;
  rtpParameters: any;
}

export async function createProducer({
  streamId,
  socket,
  userId,
  transportId,
  kind,
  rtpParameters,
}: CreateProducerParams): Promise<string> {
  const stream = StreamMap.get(streamId);
  if (!stream) throw new Error("Stream not found");

  const streamer = stream.streamer;
  if (streamer.userId !== userId) throw new Error("User is not streamer");

  const socketState = streamer.sockets.get(socket.id);
  if (!socketState) throw new Error("Streamer socket not found");

  const transport = socketState.transports.get(transportId);
  if (!transport) throw new Error("Transport not found");

  const producer: Producer = await transport.produce({
    kind,
    rtpParameters,
    appData: {
      streamId,
      socketId: socket.id,
    },
  });

  socketState.producers.set(producer.id, producer);

  console.log(
    `Producer created | stream=${streamId} kind=${kind} id=${producer.id}`
  );

  return producer.id;
}
