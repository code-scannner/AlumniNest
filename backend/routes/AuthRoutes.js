import { Router } from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { loginUser, registerStudent, registerAlumni } from "../controller/AuthController.js";

const router = Router();

router.post("/login", loginUser); // Login for both students and alumni
router.post("/signup/student", upload.single('file'), registerStudent); // Student registration
router.post("/signup/alumni",upload.single('file'), registerAlumni); // Alumni registration

export default router;
