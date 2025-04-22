import dotenv from 'dotenv';
dotenv.config();
import express, { json } from "express";
import cors from "cors";
import path from "path";
import { Server } from 'socket.io';
import http from 'http'
import { fileURLToPath } from "url";
import Authrouter from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import ConnectionRoutes from "./routes/ConnectionRoutes.js";
import NotificationRoutes from "./routes/NotificationRoutes.js";
import connectDB from "./db/db.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { getfeed } from "./controller/FeedController.js";
import socket from './socket/index.js'
import ChatRoutes from './routes/ChatRoutes.js'


const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket
const io = new Server(server, {
    cors: { origin: "*", credentials: true },
});

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(json());
app.use(cors({ origin: "*" })); // ✅ Allow all origins

// Connect to Database
connectDB();

// Routes
app.use("/api/", Authrouter);
app.use("/api/profile", UserRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/connect", ConnectionRoutes);
app.use("/api/feed", authMiddleware, getfeed);
app.use("/api/notification/", NotificationRoutes);
app.use("/api/chat/", ChatRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//connecting to web socket
socket(io)

// Start Server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
