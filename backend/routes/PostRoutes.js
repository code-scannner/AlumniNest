import { Router } from "express";
import { createPost, getPosts } from "../controller/PostController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { isLiked, likePost, unlikePost } from "../controller/LikeController.js";
const router = Router();

router.post("/", authMiddleware, upload.single('file'), createPost);
router.get("/", authMiddleware, getPosts); 
router.get("/isliked", isLiked); 
router.post("/like", authMiddleware, likePost);
router.put("/unlike", authMiddleware, unlikePost);

export default router;
