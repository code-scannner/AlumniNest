import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createOrGetChat, getAllChatsForUser } from "../controller/ChatController.js";
const router = express.Router();

router.put("/", authMiddleware, createOrGetChat);
router.get("/", authMiddleware, getAllChatsForUser);

export default router;
