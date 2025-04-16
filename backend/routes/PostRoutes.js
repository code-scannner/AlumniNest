import { Router } from "express";
import {
  createPost,
  getParticularPost,
  getPosts,
  deletePost
} from "../controller/PostController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { isLiked, likePost, unlikePost } from "../controller/LikeController.js";
import {
  addNewComment,
  deleteComment,
  getAllComments,
} from "../controller/CommentController.js";
const router = Router();

router.post("/", authMiddleware, upload.single("file"), createPost);
router.get("/", authMiddleware, getPosts);
router.get("/getposts/:id", getPosts);
router.get("/isliked", isLiked);
router.post("/like", authMiddleware, likePost);
router.put("/unlike", authMiddleware, unlikePost);

// delete comment
router.delete("/comment/:comment_id", authMiddleware, deleteComment);
// fetch all comments of post
router.get("/comment", getAllComments);

//add new comment
router.post("/comment", authMiddleware, addNewComment);

router.get("/:post_id", getParticularPost);

router.delete("/:post_id", authMiddleware, deletePost);

export default router;
