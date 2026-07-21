const Room = require("../models/Room");
const { setCooldowns } = require("../matching/matchmaker");

const ROOM_DURATION = 60 * 60 * 1000;
const autoStartTimers = new Map();

/* ==========================================
   Start Auto Timer
========================================== */

const startWaitingTimer = (io, roomId) => {

    if (autoStartTimers.has(roomId)) return;

    const timer = setTimeout(async () => {

        try {

            const room = await Room.findById(roomId);

            if (!room) return;

            if (room.status !== "waiting") return;

            if (room.participants.length < 2) return;

            room.status = "active";
            room.startedAt = new Date();

            await room.save();

            io.to(roomId).emit("room_started", {
                prompt: room.prompt,
                startedAt: room.startedAt,
                participants: room.participants.map((participant) => ({
                    handle: participant.handle,
                    level: participant.level,
                    stack: participant.stack
                }))
            });

            setTimeout(() => closeRoom(io, roomId), ROOM_DURATION);

        } catch (error) {

            console.error(error);

        }

        autoStartTimers.delete(roomId);

    }, 2 * 60 * 1000);

    autoStartTimers.set(roomId, timer);

};

/* ==========================================
   Cancel Waiting Timer
========================================== */

const cancelWaitingTimer = (roomId) => {

    if (!autoStartTimers.has(roomId)) return;

    clearTimeout(autoStartTimers.get(roomId));

    autoStartTimers.delete(roomId);

};

/* ==========================================
   Start Immediately
========================================== */

const startRoomImmediately = async (io, room) => {

    cancelWaitingTimer(room._id.toString());

    room.status = "active";

    room.startedAt = new Date();

    await room.save();

    io.to(room._id.toString()).emit("room_started", {

        prompt: room.prompt,

        startedAt: room.startedAt,

        participants: room.participants.map((participant) => ({
            handle: participant.handle,
            level: participant.level,
            stack: participant.stack
        }))

    });

    setTimeout(
        () => closeRoom(io, room._id.toString()),
        ROOM_DURATION
    );

};

/* ==========================================
   Close Room
========================================== */

const closeRoom = async (io, roomId) => {

    const room = await Room.findById(roomId);

    if (!room) return;

    if (room.status === "closed") return;

    room.status = "closed";

    room.closedAt = new Date();

    await room.save();

    await setCooldowns(roomId);

    io.to(roomId).emit("room_closed", {
        message: "This conversation stays here. Take care of yourself."
    });

};

module.exports = {

    startWaitingTimer,

    cancelWaitingTimer,

    startRoomImmediately,

    closeRoom

};