import * as mediasoupClient from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/types";

export const createDevice = async (rtp: RtpCapabilities) => {
  const device = new mediasoupClient.Device();
  console.log("New device created for you... pls wait for loading");
  await device.load({ routerRtpCapabilities: rtp });
  return device;
};
