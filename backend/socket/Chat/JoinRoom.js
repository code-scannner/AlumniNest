const joinRoom = async (socket, io) => {
    socket.on("joinRoom", (doubt_id) => {
        socket.join(doubt_id);
        console.log(`User joined room: ${doubt_id}`);
    });
};

export default joinRoom;
