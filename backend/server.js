require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Authrouter = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");
const connectDB = require("./db/db");

app.use(express.json());
app.use(cors({ origin: "*" })); // ✅ Allow all origins

connectDB();

app.use("/api/", Authrouter);
app.use("/api/profile", UserRoutes);

// 🌍 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
