import { Router } from "express";
import { getProfile, getUserProfile, updateAlumni, updateStudent } from "../controller/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getProfile); // Login for both students and alumni
router.get("/getuser/:id", getUserProfile);
router.put("/student/", authMiddleware, upload.single("file"), updateStudent); // Update student
router.put("/alumni/", authMiddleware, upload.single("file"), updateAlumni);   // Update alumni
export default router;
