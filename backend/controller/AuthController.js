const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Login user (student or alumni)
// @route   POST /api/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    let user = await Student.findOne({ email }) || await Alumni.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new student
// @route   POST /api/signup/student
exports.registerStudent = async (req, res) => {
  try {
    const { username, email, password, full_name, passout_year, phone_no, course, branch, college, bio } = req.body;

    if (await Student.findOne({ email })) return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      username, email, password: hashedPassword, full_name, passout_year, phone_no, course, branch, college, bio
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", token: generateToken(student._id), student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new alumni
// @route   POST /api/signup/alumni
exports.registerAlumni = async (req, res) => {
  try {
    const { username, email, password, full_name, batch, curr_work, position, bio } = req.body;

    if (await Alumni.findOne({ email })) return res.status(400).json({ message: "Alumni already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const alumni = new Alumni({
      username, email, password: hashedPassword, full_name, batch, curr_work, position, bio
    });

    await alumni.save();
    res.status(201).json({ message: "Alumni registered successfully", token: generateToken(alumni._id), alumni });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
