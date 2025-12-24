import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { startMediaSoupServer } from "./mediasoup/worker";

import streamerEvents from "./events/streamerEvents";
import viewerEvents from "./events/viewerEvents";
import transportEvents from "./events/transport";
import messageEvents from "./events/message";

// backend/index.ts - RIGHT AT THE TOP
console.log("🌐 MEDIASOUP CONFIG:", {
  ANNOUNCED_IP: process.env.ANNOUNCED_IP || "⚠️ NOT SET!",
});

async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Start mediasoup worker
  const worker = await startMediaSoupServer();
  console.log("Mediasoup worker started");

  // Socket auth
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (token === "your-secret-dev-token-123") {
      return next();
    }

    return next(new Error("Unauthorized"));
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    if (!worker) {
      console.log("No worker found");
      return;
    }

    streamerEvents(io, socket, worker);
    viewerEvents(io, socket);
    transportEvents(io, socket);
    messageEvents(io, socket);

    
  });

  server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
}

bootstrap().catch((err) => {
  console.error("Server failed to start", err);
  process.exit(1);
});
