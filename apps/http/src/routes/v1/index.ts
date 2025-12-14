import express from "express";
const router = express.Router();
import authRoutes from "./auth.js";
import streamRoutes from "./streams.js";

router.use("/auth", authRoutes);
router.use("/streams", streamRoutes);

export default router;
