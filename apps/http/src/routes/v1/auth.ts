import express from "express";
import authController from "../../controllers/v1/authController.js";
const router = express.Router();

router.post("/send-otp", authController.sendOtp);
router.post("/signin", authController.signin);
router.post("/verify-otp", authController.verifyOtp);

export default router;
