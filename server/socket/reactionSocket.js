module.exports = (io, socket) => {

    socket.on("reaction", ({ roomId, handle, emoji }) => {

        io.to(roomId).emit("new_reaction", {
            handle,
            emoji
        });

    });

};