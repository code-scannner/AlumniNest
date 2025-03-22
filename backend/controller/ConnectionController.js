import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";

// @desc    Send a connection request
// @route   POST /api/connection/request
// @access  Private (Students only)
export async function connectRequest(req, res) {
    try {
        const { alumni_id } = req.params;

        // Check if request already exists
        const existingRequest = await Connection.findOne({ student_id: req.user._id, alumni_id });
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }

        // Create new connection request
        const connection = new Connection({
            student_id: req.user.profile._id,
            alumni_id,
            status: "pending"
        });
        await connection.save();

        // Send notification to alumni
        const notification = new Notification({
            receiver_id: alumni_id,
            receiverModel: "Alumni",
            content: "You have a new connection request.",
            type: "connection-request"
        });
        await notification.save();

        res.status(201).json({ message: "Connection request sent", connection });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Accept a connection request
// @route   PUT /api/connect/accept/:student_id
// @access  Private (Alumni only)
export async function acceptRequest(req, res) {
    try {
        const { student_id } = req.params;
        const { accept } = req.body;
        const alumni_id = req.user.profile._id; // Alumni ID from auth middleware

        // Find the connection request
        const connection = await Connection.findOne({ student_id, alumni_id });

        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        // Ensure that only the alumni receiving the request can accept it
        if (connection.alumni_id.toString() !== alumni_id) {
            return res.status(403).json({ message: "Unauthorized to accept this request" });
        }

        if (accept) {
            connection.status = "accepted";
            await connection.save();

            // Notify student that their request was accepted
            const notification = new Notification({
                receiver_id: connection.student_id,
                receiverModel: "Student",
                content: "Your connection request was accepted!",
                type: "request-accepted"
            });
            await notification.save();

            return res.status(200).json({ message: "Connection request accepted", connection });
        } else {
            // Delete connection request if rejected
            await connection.deleteOne();
            const notification = new Notification({
                receiver_id: connection.student_id,
                receiverModel: "Student",
                content: "Your connection request was Rejected!",
                type: "request-rejected"
            });
            await notification.save();

            return res.status(200).json({ message: "Connection request rejected" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
