const User = require("../models/User");
const Room = require("../models/Room");

const {
    findOrCreateRoom,
    setCooldowns
} = require("../matching/matchmaker");

class RoomService {

    async joinRoom(userId) {

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        user.isOnline = true;

        await user.save();

        const room = await findOrCreateRoom(user);

        return {
            roomId: room._id,
            roomNumber: room.roomNumber,
            status: room.status,
            participantCount: room.participants.length,
            maxParticipants: room.maxParticipants,
            prompt: room.prompt,
            participants: room.participants.map((participant) => ({
                handle: participant.handle,
                level: participant.level,
                stack: participant.stack
            }))
        };
    }

    async getRoom(roomId) {

        const room = await Room.findById(roomId);
        if (!room) {
    throw new Error("Room not found");
}


        

        return {
            roomId: room._id,
            roomNumber: room.roomNumber,
            status: room.status,
            participantCount: room.participants.length,
            prompt: room.prompt,
            participants: room.participants.map((participant) => ({
                handle: participant.handle,
                level: participant.level,
                stack: participant.stack
            })),
            startedAt: room.startedAt
        };
    }

    async closeRoom(roomId) {

        const room = await Room.findById(roomId);

        if (!room) {
            throw new Error("Room not found");
        }

        room.status = "closed";
        room.closedAt = new Date();

        await room.save();

        await setCooldowns(room._id);

        return {
            message: "Room closed",
            roomId: room._id
        };
    }

}

module.exports = new RoomService();