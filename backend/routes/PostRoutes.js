import { Router } from "express";
import { createPost, getConnectedAlumniPosts } from "../controller/PostController.js";
import { alumniAuthMiddleware, studentAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", alumniAuthMiddleware, createPost); // Only authenticated alumni can post
router.get("/", studentAuthMiddleware, getConnectedAlumniPosts); // Only authenticated student can dig posts

export default router;
