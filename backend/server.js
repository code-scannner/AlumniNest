require("dotenv").config();
const express = require("express");
const app = express();
const Authrouter = require("./routes/AuthRoutes");
const connectDB = require("./db/db");
app.use(express.json());

connectDB();

app.use("/api/", Authrouter);
// 🌍 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
