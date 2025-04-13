import express from "express";
import { connectRequest, acceptRequest, getConnections, getRequests, getConnected } from "../controller/ConnectionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import connectionMiddleware from "../middlewares/connectionMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, getConnections);
router.get("/requests", authMiddleware, getRequests);
router.get("/myconnections", authMiddleware, getConnected);
router.post("/request/:to_user", authMiddleware, connectionMiddleware, connectRequest);
router.put("/accept/:to_user", authMiddleware, connectionMiddleware, acceptRequest);

export default router;
