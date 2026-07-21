module.exports = (io, socket) => {

    socket.on("speaking", ({ roomId, handle, isSpeaking }) => {

        socket.to(roomId).emit("user_speaking", {
            handle,
            isSpeaking
        });

    });

};