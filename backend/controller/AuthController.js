import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";
import { compare, hash } from "bcryptjs";
import pkg from "jsonwebtoken";
import { upload } from "../utils/uploadtoappwrite.js";
const { sign } = pkg;
import { sendOTP, generateOTP } from "../utils/otp.js";

// Helper function to generate JWT token
const generateToken = (id) => {
  return sign({ id }, "secret", { expiresIn: "7d" });
};

export async function updatePassword(req, res) {
  try {
    const { role, password } = req.body;
    const token = req.header("token");
    const { id } = verify(token, "secret");

    let user;
    if (role === "Student") {
      user = await Student.findById(id);
    }
    else {
      user = await Alumni.findById(id);
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.password = await hash(password, 10);

    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

}

export async function getForgetOtp(req, res) {
  try {
    const { email, role } = req.body;
    let user;
    if (role === "Student") {
      user = await Student.findOne({ email });
    }
    else {
      user = await Alumni.findOne({ email });
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const forgetOtp = generateOTP();

    user.forgetOtp = forgetOtp;

    await sendOTP(email, user.full_name, `Your otp for forget password is: ${forgetOtp}`);

    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

}

export async function verifyForgetOtp(req, res) {
  try {
    const { email, otp, role } = req.body;
    let user;
    if (role === "Student") {
      user = await Student.findOne({ email });
    }
    else {
      user = await Alumni.findOne({ email });
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.forgetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid Otp!" });
    }

    user.emailVerified = true;
    await user.save();

    const token = generateToken(user._id);

    return res.json({ token, user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}


export async function verifyEmailOtp(req, res) {
  try {
    const { email, otp, role } = req.body;
    let user;
    if (role === "Student") {
      user = await Student.findOne({ email });
    }
    else {
      user = await Alumni.findOne({ email });
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.emailOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid Otp!" });
    }

    user.emailVerified = true;
    await user.save();
    const token = generateToken(user._id);

    res.json({ token, user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}


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

    if (await Student.findOne({ email })) return res.status(400).json({ message: "Email already exists" });
    if (await Student.findOne({ username })) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await hash(password, 10);

    const emailOtp = generateOTP();
    await sendOTP(email, full_name, `Your otp for email authentication is: ${otp}`);

    const student = new Student({
      username, email, password: hashedPassword, full_name, passout_year, phone_no, course, branch, college, bio, profile_pic,
      emailOtp
    });

    await student.save();

    res.status(201).json({ success: true, message: "Student Profile Created! Verify The Otp!" });
  } catch (error) {
    console.log(error);
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

    if (await Alumni.findOne({ email })) return res.status(400).json({ message: "Email already exists" });
    if (await Alumni.findOne({ username })) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await hash(password, 10);

    const emailOtp = generateOTP();
    await sendOTP(email, full_name, `Your otp for email authentication is: ${otp}`);

    const alumni = new Alumni({
      username, email, password: hashedPassword, full_name, batch, curr_work, position, bio, profile_pic
      , emailOtp
    });

    await alumni.save();
    res.status(201).json({ success: true, message: "Alumni Profile Created! Verify The Otp!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}