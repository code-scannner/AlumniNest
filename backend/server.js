import express, { json } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Authrouter from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import ConnectionRoutes from "./routes/ConnectionRoutes.js";
import connectDB from "./db/db.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { getfeed } from "./controller/FeedController.js";

const app = express();

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

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🌍 Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
