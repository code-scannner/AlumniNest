import express, { json } from "express";
import cors from "cors";
const app = express();
import Authrouter from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import ConnectionRoutes from "./routes/ConnectionRoutes.js";
import connectDB from "./db/db.js";

app.use(json());
app.use(cors({ origin: "*" })); // ✅ Allow all origins

connectDB();

app.use("/api/", Authrouter);
app.use("/api/profile", UserRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/connect", ConnectionRoutes);

// 🌍 Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
