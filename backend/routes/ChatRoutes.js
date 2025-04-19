import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createOrGetChat, getAllChatsForUser } from "../controller/ChatController.js";
import connectionMiddleware from "../middlewares/connectionMiddleware.js";
import { getMessagesByChat } from "../controller/MessageController.js";
const router = express.Router();

router.put("/:to_user", authMiddleware, connectionMiddleware, createOrGetChat);
router.get("/", authMiddleware, getAllChatsForUser);
router.get("/messages/:chat_id", authMiddleware, getMessagesByChat);
export default router;
