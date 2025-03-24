import express from "express";
import { connectRequest, acceptRequest } from "../controller/ConnectionController.js";
import { alumniAuthMiddleware, studentAuthMiddleware } from "../middlewares/authMiddleware.js";
import { getConnectedAlumniPosts } from "../controller/PostController.js";

const router = express.Router();

router.post("/request/:alumni_id", studentAuthMiddleware, connectRequest); // Students send request
router.put("/accept/:student_id", alumniAuthMiddleware, acceptRequest); // Alumni accept request
router.get("/", studentAuthMiddleware, getConnectedAlumniPosts);

export default router;
