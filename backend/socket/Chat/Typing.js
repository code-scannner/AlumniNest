
const Typing = async (socket, io) => {
    socket.on("userTyping", ( doubt_id ) => {
        socket.to(doubt_id).emit("userTyped");
    });
};

export default Typing;
