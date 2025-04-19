import Chat from '../models/Chat.js';

export const createOrGetChat = async (req, res) => {
    try {
        const { from_user, from_model, to_user, to_model } = req.user;

        const existingChat = await Chat.findOne({
            $or: [
                {
                    from_user,
                    to_user,
                    from_model,
                    to_model
                },
                {
                    from_user: to_user,
                    to_user: from_user,
                    from_model: to_model,
                    to_model: from_model
                }
            ]
        });

        if (existingChat) {
            return res.status(200).json({ success: true, chat: existingChat });
        }

        // Create new chat
        const newChat = await Chat.create({
            from_user,
            from_model,
            to_user,
            to_model
        });

        return res.status(201).json({ success: true, chat: newChat });

    } catch (error) {
        console.error("❌ Error in createOrGetChat:", error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getAllChatsForUser = async (req, res) => {
    try {
        const { id: userId, role } = req.user;

        const chats = await Chat.find({
            $or: [
                { from_user: userId, from_model: role },
                { to_user: userId, to_model: role }
            ]
        })
            .sort({ timestamp: -1 })
            .populate('from_user', 'full_name profile_pic')
            .populate('to_user', 'full_name profile_pic');

        // Only include the other user in each chat
        const otherUsers = chats.map(chat => {
            const isFromUser = chat.from_user._id.toString() === userId;
            const otherUser = isFromUser ? chat.to_user : chat.from_user;

            return {
                _id: chat._id,
                user_id: otherUser._id,
                full_name: otherUser.full_name,
                profile_pic: otherUser.profile_pic,
            };
        });

        res.status(200).json({ success: true, chats: otherUsers });
    } catch (error) {
        console.error("❌ Error in getAllChatsForUser:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};