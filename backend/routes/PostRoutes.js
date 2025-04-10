import { Router } from "express";
import { createPost, getPosts } from "../controller/PostController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createPost); 
router.get("/", authMiddleware, getPosts); // Only authenticated student can dig posts

export default router;
