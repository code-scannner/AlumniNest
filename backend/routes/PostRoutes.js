import { Router } from "express";
import { createPost, getPosts, isLiked } from "../controller/PostController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
const router = Router();

router.post("/", authMiddleware,upload.single('file'), createPost);
router.get("/", authMiddleware, getPosts); // Only authenticated student can dig posts
router.post("/isliked", authMiddleware, isLiked); // Only authenticated student can dig posts

export default router;
