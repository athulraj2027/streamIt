import express, { type Response } from "express";
import authController from "../../controllers/v1/authController.js";
import {
  authenticate,
  type AuthRequest,
} from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/send-otp", authController.sendOtp);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
// routes/auth.ts
router.get("/me", authenticate, (req: AuthRequest, res) => {
  return res.json({
    user: req.user,
  });
});

router.post("/logout", (req: AuthRequest, res: Response) => {
  try {
    // Clear the cookie by setting it to empty and expired
    res.cookie("streamIt_token", "", {
      httpOnly: true,
      secure: true, // HTTPS only in prod
      sameSite: "none",
      path: "/",
      expires: new Date(0), // immediately expire
    });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
