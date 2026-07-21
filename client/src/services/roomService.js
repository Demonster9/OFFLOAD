import api from "./api";

const joinRoom = async () => {
    const response = await api.post("/rooms/join");
    return response.data;
};

const getRoom = async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
};

const leaveRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/leave`);
    return response.data;
};

const closeRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/close`);
    return response.data;
};

const roomService = {

    joinRoom,

    getRoom,

    leaveRoom,

    closeRoom

};

export default roomService;