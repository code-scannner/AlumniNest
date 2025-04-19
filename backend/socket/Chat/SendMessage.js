
const sendMessage = async (socket, io) => {
    socket.on("sendMessage", async (data) => {
        // try {
        //     const { doubt_id, sender_id, message } = data;

        //     if (!doubt_id || !sender_id || !message) {
        //         console.error("Missing required fields:", { doubt_id, sender_id, message });
        //         return socket.emit("error", { message: "Doubt ID, Sender ID, and Message are required." });
        //     }

        //     const chatMessage = new Chat({ doubt_id, sender_id, message });

        //     await chatMessage.save();
        //     await chatMessage.populate("sender_id", "username");

        //     io.to(doubt_id).emit("receiveMessage", chatMessage.toJSON());

        // } catch (error) {
        //     console.error("Error sending message:", error);
        //     socket.emit("error", { message: "Internal server error" });
        // }
        try {
            const { chat_id, content, sender_id, senderModel } = data;

            if (!chat_id || !content || !sender_id || !senderModel) {
                console.error("Missing required fields:", { doubt_id, sender_id, message });
                return socket.emit("error", { message: "Doubt ID, Sender ID, and Message are required." });
            }

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

            io.to(chat_id).emit("receiveMessage", msg.toJSON());

        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Internal server error" });
        }
    });
};
export default sendMessage;