const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Access Denied. No Token Provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if the user exists in Student or Alumni collection
        const student = await Student.findById(decoded.id);
        const alumni = await Alumni.findById(decoded.id);

        if (!student && !alumni) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user.role = student ? "student" : "alumni"; // Store role
        req.user.profile = student || alumni; // Store profile
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
