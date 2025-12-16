import * as mediasoup from "mediasoup";
import { Worker } from "mediasoup/types";

let worker: Worker;

export async function startMediaSoupServer() {
  try {
    worker = await mediasoup.createWorker({
      rtcMinPort: 20000,
      rtcMaxPort: 20100,
      logLevel: "warn",
      logTags: [],
    });

    console.log("new worker created ..");
    worker.on("died", (error) => {
      console.error("mediasoup worker has died", error);
      process.exit(1);
    });

    return worker
  } catch (error) {
    console.log("starting mediasoup failed : ", error);
  }
}
