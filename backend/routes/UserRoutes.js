const express = require("express");
const { getProfile, updateProfile } = require("../controller/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getProfile); // Login for both students and alumni
router.put("/", authMiddleware, updateProfile); // Student registrationn

module.exports = router;
