import joinRoom from './Chat/JoinRoom.js'
import sendMessage from "./Chat/SendMessage.js";
import Typing from "./Chat/Typing.js";

const socketManager = (io) => {
    io.on("connection", (socket) => {

        joinRoom(socket, io);
        sendMessage(socket, io);
        Typing(socket, io);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

export default socketManager;
