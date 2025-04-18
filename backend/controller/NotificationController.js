import Notification from '../models/Notification.js';

// GET /api/notification/
export const getNotifications = async (req, res) => {
    try {
        const { id, role } = req.user;

        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;

        const query = {
            receiver_id: id,
            receiverModel: role
        };

        const notifications = await Notification.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit + 1)
            .populate("receiver_id", "full_name profile_pic")
            .exec();

        const hasMore = notifications.length > limit;
        if (hasMore) notifications.pop();

        const cleaned_notifications = notifications.map(item => {
            return {
                full_name: item.receiver_id.full_name,
                profile_pic: item.profile_pic,
                _id: item._id,
                content: item.content,
                type: item.type,
                read: item.read,
                timestamp: item.timestamp
            }
        })

        res.status(200).json({ success: true, notifications: cleaned_notifications, hasMore });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Error fetching notifications" });
    }
};

// GET /api/notification/count
export const getNotificationsCount = async (req, res) => {
    try {
        const { id, role } = req.user;

        const unreadCount = await Notification.countDocuments({
            receiver_id: id,
            receiverModel: role,
            read: false
        });

        res.status(200).json({ success: true, unreadCount });
    } catch (error) {
        console.error("Error getting notification count:", error);
        res.status(500).json({ success: false, message: "Error getting notification count" });
    }
};

// PUT /api/notification/readall
export const setAllNotificationsRead = async (req, res) => {
    try {
        const { id, role } = req.user;

        await Notification.updateMany(
            { receiver_id: id, receiverModel: role, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error updating notifications:", error);
        res.status(500).json({ success: true, message: "Error updating notifications" });
    }
};
