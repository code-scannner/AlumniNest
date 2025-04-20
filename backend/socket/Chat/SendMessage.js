import Message from "../../models/Message.js";
const sendMessage = async (socket, io) => {
    socket.on("sendMessage", async (data) => {
        try {
            const { chat_id, content, sender_id, senderModel } = data;

            if (!chat_id || !content || !sender_id || !senderModel) {
                console.error("Missing required fields:", { chat_id, sender_id });
                return socket.emit("error", { message: "Chat ID, Sender ID, and Message are required." });
            }

            await Message.updateMany(
                {
                    chat_id,
                    sender_id: { $ne: sender_id },
                    status: "sent"
                },
                {
                    $set: { status: "read" }
                }
            );

            // Save message to DB
            const newMessage = new Message({
                sender_id,
                senderModel,
                content,
                chat_id
            });

            await newMessage.save();
            await newMessage.populate("sender_id", 'full_name profile_pic');

            const msg = {
                _id: newMessage._id,
                content: newMessage.content,
                status: newMessage.status,
                timestamp: newMessage.timestamp,
                sender_id: newMessage.sender_id?._id,
                full_name: newMessage.sender_id?.full_name,
                profile_pic: newMessage.sender_id?.profile_pic
            };

            io.to(chat_id).emit("receiveMessage", msg);

        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Internal server error" });
        }
    });
};
export default sendMessage;