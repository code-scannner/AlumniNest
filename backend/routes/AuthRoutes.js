import { Router } from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { loginUser, registerStudent, registerAlumni, verifyEmailOtp, verifyForgetOtp, getForgetOtp, updatePassword } from "../controller/AuthController.js";

const router = Router();

router.post("/login", loginUser); // Login for both students and alumni
router.post("/verify/email", verifyEmailOtp);
router.post("/verify/forgot", verifyForgetOtp);
router.post("/forgot", getForgetOtp);
router.post("/updatepass", updatePassword);
router.post("/signup/student", upload.single('file'), registerStudent); // Student registration
router.post("/signup/alumni", upload.single('file'), registerAlumni); // Alumni registration

export default router;
