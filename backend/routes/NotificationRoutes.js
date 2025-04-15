import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getNotifications, getNotificationsCount, setAllNotificationsRead } from "../controller/NotificationController";
const router = express.Router();

// GET all notifications with pagination
router.get('/', authMiddleware, getNotifications);

// GET count of unread notifications
router.get('/count', authMiddleware, getNotificationsCount);

// PUT mark all notifications as read
router.put('/readall', authMiddleware, setAllNotificationsRead);

export default router;
