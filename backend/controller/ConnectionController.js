import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import Alumni from "../models/Alumni.js";
import Student from "../models/Student.js";

// @route GET /api/connect/requests
export async function getRequests(req, res) {
    try {
        const userId = req.user.id;
        const userModel = req.user.role;

        const pendingRequests = await Connection.find({
            to_user: userId,
            to_model: userModel,
            status: "pending"
        }).populate("from_user");

        const requests = pendingRequests.map(req => (req.from_user));

        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error("Error in getRequests:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// @route GET /api/connect/myconnections
export async function getConnected(req, res) {
    try {
        const userId = req.user.id;
        const userModel = req.user.role;

        const connections = await Connection.find({
            status: 'accepted',
            $or: [
                { from_user: userId, from_model: userModel },
                { to_user: userId, to_model: userModel }
            ]
        });

        const connectedUsers = await Promise.all(
            connections.map(async (conn) => {
                const isSender = conn.from_user.toString() === userId;

                const connectedUserId = isSender ? conn.to_user : conn.from_user;
                const connectedUserModel = isSender ? conn.to_model : conn.from_model;

                let user = null;

                if (connectedUserModel === 'Alumni') {
                    user = await Alumni.findById(connectedUserId);
                } else if (connectedUserModel === 'Student') {
                    user = await Student.findById(connectedUserId);
                }

                if (user) {
                    return {
                        ...user.toObject(),
                        role: connectedUserModel
                    };
                } else {
                    return null;
                }
            })
        );

        const filteredUsers = connectedUsers.filter(u => u !== null);

        res.status(200).json({ connected: filteredUsers });
    } catch (error) {
        console.error("Error in getConnected:", error);
        res.status(500).json({ message: error.message });
    }
}

// @route   GET /api/connect/
// @access  Private 
export async function getConnections(req, res) {
    try {
        const userId = req.user.id;
        const userModel = req.user.role;

        let { search } = req.body;


        const query = search
            ? { username: { $regex: search, $options: 'i' }, _id: { $ne: userId } }
            : { _id: { $ne: userId } };

        const alumniList = await Alumni.find(query);
        const studentsList = await Student.find(query);

        const alumniIds = alumniList.map(alumni => alumni._id);
        const studentsIds = studentsList.map(student => student._id);
        const allUserIds = [...alumniIds, ...studentsIds];

        const connections = await Connection.find({
            $or: [
                { from_user: userId, to_user: { $in: allUserIds } },
                { to_user: userId, from_user: { $in: allUserIds } }
            ]
        });

        const alumniWithStatus = alumniList.map(alumni => {
            const conn = connections.find(c =>
                (c.from_user.toString() === userId && c.to_user.toString() === alumni._id.toString()) ||
                (c.to_user.toString() === userId && c.from_user.toString() === alumni._id.toString())
            );

            let status = 'not_connected';
            if (conn) {
                status = conn.status;
            }

            return {
                ...alumni._doc,
                userType: 'alumni',
                status
            };
        });

        const studentsWithStatus = studentsList.map(student => {
            const conn = connections.find(c =>
                (c.from_user.toString() === userId && c.to_user.toString() === student._id.toString()) ||
                (c.to_user.toString() === userId && c.from_user.toString() === student._id.toString())
            );

            let status = 'not_connected';
            if (conn) {
                status = conn.status;
            }

            return {
                ...student._doc,
                userType: 'student',
                status
            };
        });

        const allConnections = shuffleArray([...alumniWithStatus, ...studentsWithStatus]);


        res.status(200).json({ connections: allConnections });
    } catch (error) {
        console.error("Error in getConnections:", error);
        res.status(500).json({ message: error.message });
    }
}


// @desc    Send a connection request
// @route   POST /api/connect/request/:to_user
export async function connectRequest(req, res) {
    try {

        const { from_user, from_model, to_user, to_model } = req.user;

        // Check if connection already exists
        let existingRequest = await Connection.findOne({
            from_user,
            from_model,
            to_user,
            to_model
        });

        if (existingRequest) {
            return res.status(409).json({ success: false, message: `Connection request already ${existingRequest.status}.` });
        }

        existingRequest = await Connection.findOne({
            from_user: to_user,
            from_model: to_model,
            to_user: from_user,
            to_model: from_model
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: `Connection request already ${existingRequest.status} from other user`
            });
        }

        // Create connection request
        const connection = new Connection({
            from_user,
            from_model,
            to_user,
            to_model
        });
        console.log(connection);
        await connection.save();

        // Notify the receiver
        const notification = new Notification({
            receiver_id: to_user,
            receiverModel: to_model,
            content: `You have a new connection request from ${req.user.profile.username}`,
            type: "connection-request"
        });
        await notification.save();

        res.status(201).json({ success: true, message: "Connection request sent." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// @desc    Accept a connection request
// @route   PUT /api/connect/accept/:to_user
export async function acceptRequest(req, res) {
    try {

        const { from_user, from_model, to_user, to_model } = req.user;

        const { accept } = req.body;

        // Find the connection request
        const connection = await Connection.findOne({ to_user: from_user, from_user: to_user });

        if (!connection) {
            return res.status(404).json({ success: false, message: "Connection request not found" });
        }

        if (connection.status != 'pending') {
            return res.status(404).json({ success: false, message: `Connection is already ${connection.status}` });
        }

        if (accept) {
            if (connection.status == 'accept') {
                return res.status(404).json({ success: false, message: 'Connection already accepted.' })
            }

            connection.status = "accepted";
            await connection.save();

            // Notify that their request was accepted
            const notification = new Notification({
                receiver_id: to_user,
                receiverModel: to_model,
                content: `Your connection request was accepted by ${req.user.profile.username}`,
                type: "request-accepted"
            });
            await notification.save();

            return res.status(200).json({ success: true, message: "Connection request accepted" });
        } else {
            // Delete connection request if rejected
            await connection.deleteOne();
            const notification = new Notification({
                receiver_id: to_user,
                receiverModel: to_model,
                content: `Your connection request was rejected by ${req.user.profile.username}`,
                type: "request-rejected"
            });
            await notification.save();

            return res.status(200).json({ success: true, message: "Connection request rejected" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
