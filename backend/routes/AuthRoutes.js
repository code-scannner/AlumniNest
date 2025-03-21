const express = require("express");
const { loginUser, registerStudent, registerAlumni } = require("../controller/AuthController");

const router = express.Router();

router.post("/login", loginUser); // Login for both students and alumni
router.post("/signup/student", registerStudent); // Student registration
router.post("/signup/alumni", registerAlumni); // Alumni registration

module.exports = router;
