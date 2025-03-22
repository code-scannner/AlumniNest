import { Router } from "express";
import { getProfile, updateProfile } from "../controller/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getProfile); // Login for both students and alumni
router.put("/", authMiddleware, updateProfile); // Student registrationn

export default router;
