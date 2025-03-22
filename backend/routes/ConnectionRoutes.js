import express from "express";
import { connectRequest, acceptRequest } from "../controller/ConnectionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:alumni_id", authMiddleware, connectRequest); // Students send request
router.put("/accept/:student_id", authMiddleware, acceptRequest); // Alumni accept request

export default router;
