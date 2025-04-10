import { Router } from "express";
import { createPost, getPosts } from "../controller/PostController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
const router = Router();

router.post("/", authMiddleware,upload.single('file'), createPost);
router.get("/", authMiddleware, getPosts); // Only authenticated student can dig posts

export default router;
