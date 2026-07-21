const roomSocket = require("./roomSocket");
const chatSocket = require("./chatSocket");
const reactionSocket = require("./reactionSocket");
const presenceSocket = require("./presenceSocket");

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log(`[SOCKET] Connected ${socket.id}`);

        roomSocket(io, socket);
        chatSocket(io, socket);
        reactionSocket(io, socket);
        presenceSocket(io, socket);

    });

};