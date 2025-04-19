import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";

const connectionMiddleware = async (req, res, next) => {
    try {
        const { to_user } = req.params;

        req.user.to_user = to_user;

        // Check if the user exists in Student or Alumni collection
        const student = await Student.findById(to_user);
        const alumni = await Alumni.findById(to_user);

        if (!student && !alumni) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const to_model = student ? "Student" : "Alumni"; // Store role
        req.user.to_model = to_model;

        const from_user = req.user.id;
        const from_model = req.user.role;

        req.user.from_user = from_user;
        req.user.from_model = from_model;

        // Prevent self connection
        if (to_user.toString() === from_user.toString() && to_model === from_model) {
            return res.status(400).json({ success: false, message: "Same Users Trying to Engage." });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error });
    }
};


export default connectionMiddleware;