import { Router } from "express";
import { createPost, getPosts } from "../controller/PostController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { isLiked, likePost, unlikePost } from "../controller/LikeController.js";
import { addNewComment, deleteComment, getAllComments } from "../controller/CommentController.js";
const router = Router();

router.post("/", authMiddleware, upload.single('file'), createPost);
router.get("/", authMiddleware, getPosts); 
router.get("/isliked", isLiked); 
router.post("/like", authMiddleware, likePost);
router.delete("/unlike", authMiddleware, unlikePost);

// fetch all comments of post
router.get("/comment", getAllComments);

//add new comment
router.post("/comment", authMiddleware, addNewComment);

// delete comment
router.delete("/comment", authMiddleware, deleteComment);


export default router;
