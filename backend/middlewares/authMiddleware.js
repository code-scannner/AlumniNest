import pkg from "jsonwebtoken";
const { verify } = pkg;
import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      console.log("No token provided");
      return res
        .status(401)
        .json({ message: "Access Denied. No Token Provided" });
    }

    const decoded = verify(token, "secret");
    req.user = decoded;

    // Check if the user exists in Student or Alumni collection
    const student = await Student.findById(decoded.id);
    const alumni = await Alumni.findById(decoded.id);

    if (!student && !alumni) {
      console.log("User not found in both collections");
      return res.status(404).json({ message: "User not found" });
    }

    req.user.role = student ? "Student" : "Alumni"; // Store role
    req.user.profile = student || alumni; // Store profile
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
    console.log("Invalid Token");
  }
};
