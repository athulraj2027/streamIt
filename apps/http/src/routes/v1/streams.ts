import express from "express";
const router = express.Router();
import streamController from "../../controllers/v1/streamController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

router.post("/", authenticate, streamController.createStream);
router.get("/", streamController.getAllStreams);
router.patch("/", authenticate, streamController.endStream);
router.post("/join/:id", authenticate, streamController.joinStream);
router.post("/leave/:id", authenticate, streamController.leaveStream);

export default router;
