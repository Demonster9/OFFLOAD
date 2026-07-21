module.exports = (io, socket) => {

    socket.on("send_message", ({ roomId, handle, message }) => {

        io.to(roomId).emit("new_message", {
            handle,
            message,
            timestamp: new Date()
        });

    });

};