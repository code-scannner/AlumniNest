const Student = require("../models/Student");
const Alumni = require("../models/Alumni");

// Get Profile
const getProfile = async (req, res) => {
    try {
        res.status(200).json({ info: req.user.profile, type: req.user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { role, profile } = req.user;
        const { full_name, profile_pic, bio, phone_no, resume, curr_work, position } = req.body;

        let updatedFields = { full_name, profile_pic, bio };

        if (role === "student") {
            updatedFields.phone_no = phone_no;
            updatedFields.resume = resume;
        } else if (role === "alumni") {
            updatedFields.curr_work = curr_work;
            updatedFields.position = position;
        }

        // Update in the correct collection
        const updatedProfile = role === "student"
            ? await Student.findByIdAndUpdate(profile._id, updatedFields, { new: true })
            : await Alumni.findByIdAndUpdate(profile._id, updatedFields, { new: true });

        res.status(200).json({ message: "Profile updated successfully", info: updatedProfile, type: role });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getProfile, updateProfile };
