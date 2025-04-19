import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const getMessagesByChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chat_id } = req.body;

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

        // 2. Get all messages in this chat
        const messages = await Message.find({ chat_id })
            .populate({
                path: 'sender_id',
                select: 'full_name profile_pic' 
            })
            .sort({ timestamp: 1 });

        const transformedMessages = messages.map(msg => ({
            content: msg.content,
            status: msg.status,
            timestamp: msg.timestamp,
            sender_id: msg.sender_id?._id,
            full_name: msg.sender_id?.full_name,
            profile_pic: msg.sender_id?.profile_pic
        }));

        return res.status(200).json({ message: transformedMessages });
    } catch (error) {
        console.error("❌ Error in getMessagesByChat:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
