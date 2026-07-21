import { io } from "socket.io-client";

const socket = io(
    process.env.REACT_APP_API_URL || "http://localhost:5000",
    {
        autoConnect: false,
        transports: ["websocket", "polling"]
    }
);

export const connectSocket = (token) => {

    socket.auth = { token };

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const disconnectSocket = () => {

    if (socket.connected) {
        socket.disconnect();
    }

};

export default socket;