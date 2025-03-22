import { Router } from "express";
import { loginUser, registerStudent, registerAlumni } from "../controller/AuthController.js";

const router = Router();

router.post("/login", loginUser); // Login for both students and alumni
router.post("/signup/student", registerStudent); // Student registration
router.post("/signup/alumni", registerAlumni); // Alumni registration

export default router;
