
const sendMessage = async (socket, io) => {
    socket.on("sendMessage", async (data) => {
        try {
            // const { doubt_id, sender_id, message } = data;

            // if (!doubt_id || !sender_id || !message) {
            //     console.error("Missing required fields:", { doubt_id, sender_id, message });
            //     return socket.emit("error", { message: "Doubt ID, Sender ID, and Message are required." });
            // }

            // const chatMessage = new Chat({ doubt_id, sender_id, message });

            // await chatMessage.save();
            // await chatMessage.populate("sender_id", "username");

            // io.to(doubt_id).emit("receiveMessage", chatMessage.toJSON());

        } catch (error) {
            // console.error("Error sending message:", error);
            // socket.emit("error", { message: "Internal server error" });
        }
    });
};
export default sendMessage;