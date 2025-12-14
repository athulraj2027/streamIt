import type { Request, Response } from "express";
import prisma from "@repo/db/client";

import crypto from "crypto";

export const createStream = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const { id: userId } = req.user;

    if (!name)
      return res.status(400).json({ message: "Stream name is required" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const existingName = await prisma.stream.findFirst({
      where: { title: name },
    });

    if (existingName)
      return res.status(409).json({
        message: "Stream title already exists",
      });

    const existingLiveStream = await prisma.stream.findFirst({
      where: {
        creatorId: userId,
        status: "LIVE",
      },
    });

    if (existingLiveStream) {
      return res.status(403).json({
        message: "You already have an active live stream",
      });
    }

    const streamKey = crypto.randomBytes(24).toString("hex");

    const stream = await prisma.stream.create({
      data: {
        title: name,
        description,
        streamKey,
        creatorId: userId,
        status: "LIVE",
      },
    });

    return res.status(201).json({
      message: "Stream created successfully",
      stream,
    });
  } catch (error) {
    console.error("Create stream error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllStreams = async (req: Request, res: Response) => {
  try {
    const streams = await prisma.stream.findMany({
      where: { status: "LIVE" },
      orderBy: { viewerCount: "desc" },
    });

    const channels = streams.map((stream) => ({
      id: stream.id,
      name: stream.title,
      viewers: stream.viewerCount,
      live: stream.status === "LIVE",
    }));

    return res.json(channels);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const joinStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return;
    const stream = await prisma.stream.findUnique({
      where: { id },
    });

    if (!stream || stream.status !== "LIVE") {
      return res.status(404).json({ message: "Stream not live" });
    }

    const updatedStream = await prisma.stream.update({
      where: { id },
      data: {
        viewerCount: { increment: 1 },
        totalViews: { increment: 1 },
      },
    });

    return res.json(updatedStream);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const leaveStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return;

    const stream = await prisma.stream.findUnique({
      where: { id },
    });

    if (!stream || stream.viewerCount <= 0) {
      return res.status(400).json({ message: "Invalid stream state" });
    }

    const updatedStream = await prisma.stream.update({
      where: { id },
      data: {
        viewerCount: { decrement: 1 },
      },
    });

    return res.json(updatedStream);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const endStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;

    const updatedStream = await prisma.stream.updateMany({
      where: {
        creatorId: id,
        status: "LIVE",
      },
      data: {
        status: "ENDED",
        viewerCount: 0,
      },
    });

    return res.json(updatedStream);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return;

    const stream = await prisma.stream.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }

    return res.json(stream);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createStream,
  joinStream,
  leaveStream,
  endStream,
  getStream,
  getAllStreams,
};
