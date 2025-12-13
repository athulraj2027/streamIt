import express from "express";
import authController from "../../controllers/v1/authController.js";
const router = express.Router();

router.post("/send-otp", authController.sendOtp);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);

export default router;
