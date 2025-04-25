import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";
import { upload, deleteFile } from "../utils/uploadtoappwrite.js";

// getting user profile
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        const alumni = await Alumni.findById(id);
        if (!student && !alumni) res.status(404).json(
            { success: false, message: 'User not found' }
        );
        const role = student ? "Student" : "Alumni"

        res.status(200).json({
            success: true,
            info: { ...(student || alumni)._doc, role }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
}


// Get Profile
export const getProfile = async (req, res) => {
    try {
        res.status(200).json({ info: req.user.profile, type: req.user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Update student profile
// @route   PUT /api/profile/student/
export async function updateStudent(req, res) {
    try {
        const { id } = req.user;

        const updates = req.body;

        const localPath = req.file?.path;
        if (localPath) {
            if (req.user.profile.profile_pic) {
                console.log("Deleting prev file ", req.user.profile.profile_pic)
                await deleteFile(req.user.profile.profile_pic);
            }
            updates.profile_pic = await upload(localPath);
            console.log("uploaded new pic ", updates.profile_pic);
        }

        if (updates.password) {
            updates.password = await hash(updates.password, 10);
        }

        const student = await Student.findByIdAndUpdate(id, updates, { new: true });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Student updated successfully", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// @desc    Update alumni profile
// @route   PUT /api/profile/alumni/
export async function updateAlumni(req, res) {
    try {
        const { id } = req.user;
        const updates = req.body;

        const localPath = req.file?.path;
        if (localPath) {
            if (req.user.profile.profile_pic) {
                await deleteFile(req.user.profile.profile_pic);
            }
            updates.profile_pic = await upload(localPath);
        }

        if (updates.password) {
            updates.password = await hash(updates.password, 10);
        }

        const alumni = await Alumni.findByIdAndUpdate(id, updates, { new: true });

        if (!alumni) return res.status(404).json({ message: "Alumni not found" });

        res.status(200).json({ message: "Alumni updated successfully", alumni });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}