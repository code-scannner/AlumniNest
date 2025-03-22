import { Router } from "express";
import { createPost } from "../controller/PostController.js";
import { alumniAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", alumniAuthMiddleware, createPost); // Only authenticated alumni can post

export default router;
