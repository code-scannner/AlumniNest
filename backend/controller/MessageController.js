import Alumni from '../models/Alumni.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Student from '../models/Student.js';

export const getMessagesByChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chat_id } = req.params;

        // 1. Validate that the user is part of the chat
        const chat = await Chat.findById(chat_id);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (
            chat.from_user.toString() !== userId &&
            chat.to_user.toString() !== userId
        ) {
            return res.status(403).json({ message: "You are not part of this chat" });
        }

        const otherUser = chat.from_user.toString() === userId ? chat.to_user.toString() : chat.from_user.toString();

        const student = await Student.findById(otherUser);
        const alumni = await Alumni.findById(otherUser);

        if (!student && !alumni) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const chatPerson = student || alumni;

        // 2. Get all messages in this chat
        const messages = await Message.find({ chat_id })
            .populate({
                path: 'sender_id',
                select: 'full_name profile_pic'
            })
            .sort({ timestamp: 1 });

        const transformedMessages = messages.map(msg => ({
            _id: msg._id,
            chat_id: msg.chat_id,
            sender_id: msg.sender_id?._id,
            full_name: msg.sender_id?.full_name,
            profile_pic: msg.sender_id?.profile_pic,
            content: msg.content,
            status: msg.status,
            timestamp: msg.timestamp,
        }));

        return res.status(200).json({ success: true, chatPerson, messages: transformedMessages });
    } catch (error) {
        console.error("❌ Error in getMessagesByChat:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const readAllMessages = async (req, res) => {
    try {
        const { id: sender_id, role: senderModel } = req.user;

        const result = await Message.updateMany(
            {
                sender_id,
                senderModel,
                status: { $ne: "read" } // only unread messages
            },
            {
                $set: { status: "read" }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Messages marked as read",
            updatedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("❌ Error in readMessagesFromSender:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
