import { Router } from "express";
import { getProfile, getUserProfile, updateAlumni, updateStudent } from "../controller/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getProfile); 
router.get("/getuser/:id", getUserProfile);
router.put("/student/", authMiddleware, upload.single("file"), updateStudent);
router.put("/alumni/", authMiddleware, upload.single("file"), updateAlumni);
export default router;
