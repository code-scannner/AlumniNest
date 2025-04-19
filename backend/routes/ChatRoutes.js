import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createOrGetChat, getAllChatsForUser } from "../controller/ChatController.js";
import connectionMiddleware from "../middlewares/connectionMiddleware.js";
const router = express.Router();

router.put("/", connectionMiddleware, createOrGetChat);
router.get("/", authMiddleware, getAllChatsForUser);

export default router;
