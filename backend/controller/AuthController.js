import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";
import { compare, hash } from "bcryptjs";
import pkg from "jsonwebtoken";
import { upload } from "../utils/uploadtoappwrite.js";
const { sign } = pkg;

// Helper function to generate JWT token
const generateToken = (id) => {
  return sign({ id }, "secret", { expiresIn: "7d" });
};

// @desc    Login user (student or alumni)
// @route   POST /api/login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    let user = await Student.findOne({ email }) || await Alumni.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Register a new student
// @route   POST /api/signup/student
export async function registerStudent(req, res) {
  try {
    const { username, email, password, full_name, passout_year, phone_no, course, branch, college, bio } = req.body;

    const localPath = req.file?.path;
    const profile_pic = localPath ? await upload(localPath) : null;

    if (await Student.findOne({ email })) return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await hash(password, 10);

    const student = new Student({
      username, email, password: hashedPassword, full_name, passout_year, phone_no, course, branch, college, bio, profile_pic
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", token: generateToken(student._id), student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Register a new alumni
// @route   POST /api/signup/alumni
export async function registerAlumni(req, res) {
  try {
    const { username, email, password, full_name, batch, curr_work, position, bio } = req.body;
    const localPath = req.file?.path;
    const profile_pic = localPath ? await upload(localPath) : null;

    if (await Alumni.findOne({ email })) return res.status(400).json({ message: "Alumni already exists" });

    const hashedPassword = await hash(password, 10);

    const alumni = new Alumni({
      username, email, password: hashedPassword, full_name, batch, curr_work, position, bio, profile_pic
    });

    await alumni.save();
    res.status(201).json({ message: "Alumni registered successfully", token: generateToken(alumni._id), alumni });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}