const Room = require("../models/Room");
const User = require("../models/User");
const { setCooldowns } = require("../matching/matchmaker");

const ROOM_DURATION = 60 * 60 * 1000;
const AUTO_START_DELAY = 2 * 60 * 1000;

const countdownTimers = new Map();

const roomCloseTimers = new Map();

module.exports = (io, socket) => {

    console.log(`[SOCKET] Connected : ${socket.id}`);

        /* ==========================================
           JOIN ROOM
        ========================================== */

        socket.on("join_room", async (payload) => {

            try {

                const {
                    roomId,
                    handle,
                    level,
                    stack
                } = payload;

                if (!roomId || !handle) {
                    return socket.emit("room_error", {
                        message: "Invalid room."
                    });
                }

                const room = await Room.findById(roomId);

                if (!room) {
                    return socket.emit("room_error", {
                        message: "Room not found."
                    });
                }

                socket.join(roomId);

                socket.roomId = roomId;
                socket.handle = handle;
                await new Promise(resolve => setTimeout(resolve, 100));

                console.log(
                    `[ROOM] ${handle} joined ${room.roomNumber}`
                );

                /* ==========================================
                   Send Room State
                ========================================== */

                socket.emit("room_state", {

                    roomId: room._id.toString(),

                    roomNumber: room.roomNumber,

                    status: room.status,

                    prompt: room.prompt,

                    participantCount:
                        room.participants.length,

                    maxParticipants:
                        room.maxParticipants,

                        countdownStartedAt:
    room.countdownStartedAt,

                    startedAt: room.startedAt,

                    participants:
                        room.participants.map((p) => ({

                            handle: p.handle,

                            level: p.level,

                            stack: p.stack

                        }))

                });

                /* ==========================================
                   Notify Others
                ========================================== */

                socket.to(roomId).emit("user_joined", {

                    handle,

                    level,

                    stack,

                    participantCount:
                        room.participants.length

                });

                /* ==========================================
                   Already Active
                ========================================== */

                if (room.status === "active") {

                    socket.emit("room_started", {

                        roomId: room._id.toString(),

                        roomNumber: room.roomNumber,

                        status: room.status,

                        prompt: room.prompt,

                        startedAt: room.startedAt,

                        participants:
                            room.participants.map((p) => ({

                                handle: p.handle,

                                level: p.level,

                                stack: p.stack

                            }))

                    });

                    return;

                }

                               /* ==========================================
                   Start Countdown
                ========================================== */

                if (
                    room.status === "waiting" &&
                    room.participants.length >= 2 &&
                    !room.countdownStartedAt
                ) {

                    room.countdownStartedAt =
                        new Date();

                    await room.save();

                    console.log(
                        `[ROOM] Countdown started : ${room.roomNumber}`
                    );

                    io.to(roomId).emit(
                        "countdown_started",
                        {

                            countdownStartedAt:
                                room.countdownStartedAt,

                            duration: 120

                        }
                    );

                    const timer = setTimeout(async () => {

                        try {

                            const freshRoom =
                                await Room.findById(roomId);

                            if (!freshRoom) {

                                countdownTimers.delete(roomId);

                                return;

                            }

                            if (
                                freshRoom.status !== "waiting"
                            ) {

                                countdownTimers.delete(roomId);

                                return;

                            }

                            if (
                                freshRoom.participants.length < 2
                            ) {

                                freshRoom.countdownStartedAt =
                                    null;

                                await freshRoom.save();

                                countdownTimers.delete(roomId);

                                return;

                            }

                            freshRoom.status = "active";

                            freshRoom.startedAt =
                                new Date();

                            await freshRoom.save();

                            console.log(
                                `[ROOM] Started : ${freshRoom.roomNumber}`
                            );
console.log(
    "ROOM START (Countdown)",
    freshRoom.roomNumber,
    "Socket Count:",
    io.sockets.adapter.rooms.get(roomId)?.size
);
                            io.to(roomId).emit(
                                "room_started",
                                {

                                    roomId:
                                        freshRoom._id.toString(),

                                    roomNumber:
                                        freshRoom.roomNumber,

                                    status:
                                        freshRoom.status,

                                    prompt:
                                        freshRoom.prompt,

                                    startedAt:
                                        freshRoom.startedAt,

                                    participants:
                                        freshRoom.participants.map(
                                            (p) => ({

                                                handle:
                                                    p.handle,

                                                level:
                                                    p.level,

                                                stack:
                                                    p.stack

                                            })
                                        )

                                }
                            );
                                     /* ==========================================
                               Auto Close Room
                            ========================================== */

                            const closeTimer = setTimeout(() => {

                                closeRoom(io, roomId);

                            }, ROOM_DURATION);

                            roomCloseTimers.set(
                                roomId,
                                closeTimer
                            );

                            countdownTimers.delete(
                                roomId
                            );

                        }

                        catch (error) {

                            console.error(
                                "[ROOM] Auto Start:",
                                error
                            );

                        }

                    }, AUTO_START_DELAY);

                    countdownTimers.set(
                        roomId,
                        timer
                    );

                }

                /* ==========================================
                   Start Immediately When Full
                ========================================== */

                if (
                    room.status === "waiting" &&
                    room.participants.length >= room.maxParticipants
                ) {

                    if (
                        countdownTimers.has(roomId)
                    ) {

                        clearTimeout(
                            countdownTimers.get(roomId)
                        );

                        countdownTimers.delete(
                            roomId
                        );

                    }

                    room.status = "active";

                    room.startedAt =
                        new Date();

                    await room.save();

                    console.log(
                        `[ROOM] Full Room Started : ${room.roomNumber}`
                    );
console.log(
    "ROOM START (Full)",
    room.roomNumber,
    "Socket Count:",
    io.sockets.adapter.rooms.get(roomId)?.size
);
                    io.to(roomId).emit(
                        "room_started",
                        {

                            roomId:
                                room._id.toString(),

                            roomNumber:
                                room.roomNumber,

                            status:
                                room.status,

                            prompt:
                                room.prompt,

                            startedAt:
                                room.startedAt,

                            participants:
                                room.participants.map(
                                    (p) => ({

                                        handle:
                                            p.handle,

                                        level:
                                            p.level,

                                        stack:
                                            p.stack

                                    })
                                )

                        }
                    );

                    const closeTimer =
                        setTimeout(() => {

                            closeRoom(
                                io,
                                roomId
                            );

                        }, ROOM_DURATION);

                    roomCloseTimers.set(
                        roomId,
                        closeTimer
                    );

                }

            }

            catch (error) {

                console.error(
                    "[SOCKET] join_room:",
                    error
                );

                socket.emit(
                    "room_error",
                    {

                        message:
                            "Unable to join room."

                    }
                );

            }

        });

       

        /* ==========================================
           Emoji Reactions
        ========================================== */

        socket.on("reaction", (data) => {

            io.to(data.roomId).emit(
                "new_reaction",
                {

                    handle: data.handle,

                    emoji: data.emoji

                }
            );

        });

        /* ==========================================
           Speaking Indicator
        ========================================== */

        socket.on("speaking", (data) => {

            socket.to(data.roomId).emit(
                "user_speaking",
                {

                    handle: data.handle,

                    isSpeaking: data.isSpeaking

                }
            );

        });

        /* ==========================================
   Leave Room
========================================== */

socket.on(
    "leave_room",
    async ({ roomId, handle }) => {

        try {

            socket.leave(roomId);

            console.log(
                `[ROOM] ${handle} left`
            );

            const room =
                await Room.findById(roomId);

            if (!room) return;

            /* ======================================
               Waiting Room
            ====================================== */

            if (room.status === "waiting") {

                room.participants =
                    room.participants.filter(
                        (p) =>
                            p.handle !== handle
                    );

                /* ----------------------------------
                   Stop Countdown if < 2 users
                ---------------------------------- */

                if (room.participants.length < 2) {

                    room.countdownStartedAt = null;

                    if (
                        countdownTimers.has(roomId)
                    ) {

                        clearTimeout(
                            countdownTimers.get(roomId)
                        );

                        countdownTimers.delete(
                            roomId
                        );

                    }

                }

                /* ----------------------------------
                   Delete Empty Room
                ---------------------------------- */

                if (
                    room.participants.length === 0
                ) {

                    if (
                        roomCloseTimers.has(roomId)
                    ) {

                        clearTimeout(
                            roomCloseTimers.get(roomId)
                        );

                        roomCloseTimers.delete(
                            roomId
                        );

                    }

                    await Room.findByIdAndDelete(
                        roomId
                    );

                    console.log(
                        `[ROOM] Deleted Empty Room ${room.roomNumber}`
                    );

                }

                else {

                    await room.save();

                    /* ------------------------------
                       Notify Remaining Users
                    ------------------------------ */

             

io.to(roomId).emit("user_left", {
    handle,
    participantCount: room.participants.length
});

// Auto close if only one participant remains
if (room.participants.length <= 1) {

    console.log(
        `[ROOM] Only one participant left. Closing room ${room.roomNumber}`
    );

    await closeRoom(io, roomId);

    return;
}

                    /* ------------------------------
                       Send Fresh Room State
                    ------------------------------ */

                    io.to(roomId).emit(
                        "room_state",
                        {

                            roomId:
                                room._id.toString(),

                            roomNumber:
                                room.roomNumber,

                            status:
                                room.status,

                            participantCount:
                                room.participants.length,

                            maxParticipants:
                                room.maxParticipants,

                            countdownStartedAt:
                                room.countdownStartedAt,

                            startedAt:
                                room.startedAt,

                            participants:
                                room.participants.map(
                                    (p) => ({

                                        handle:
                                            p.handle,

                                        level:
                                            p.level,

                                        stack:
                                            p.stack

                                    })
                                )

                        }
                    );

                }

            }

           /* ======================================
   Active Room
====================================== */

else {

    room.participants = room.participants.filter(
        (p) => p.handle !== handle
    );

    await room.save();

    io.to(roomId).emit("user_left", {
        handle,
        participantCount: room.participants.length
    });

    io.to(roomId).emit("room_state", {

        roomId: room._id.toString(),

        roomNumber: room.roomNumber,

        status: room.status,

        prompt: room.prompt,

        startedAt: room.startedAt,

        participantCount: room.participants.length,

        maxParticipants: room.maxParticipants,

        participants: room.participants.map((p) => ({
            handle: p.handle,
            level: p.level,
            stack: p.stack
        }))

    });

    if (room.participants.length <= 1) {

        console.log(
            `[ROOM] Auto closing ${room.roomNumber}`
        );

        await closeRoom(io, roomId);

        return;

    }

}

            /* ======================================
               Update User Status
            ====================================== */

            await User.findOneAndUpdate(

                { handle },

                {

                    isOnline: false,

                    lastSeen: new Date()

                }

            );

        }

        catch (error) {

            console.error(
                "[SOCKET] leave_room:",
                error
            );

        }

    }

);

        /* ==========================================
           Disconnect
        ========================================== */

        socket.on(
            "disconnect",
            async () => {

                console.log(
                    `[SOCKET] Disconnected ${socket.id}`
                );

                if (
                    !socket.roomId ||
                    !socket.handle
                ) {
                    return;
                }

                try {

                    io.to(socket.roomId).emit(
                        "user_left",
                        {

                            handle: socket.handle

                        }
                    );

                    await User.findOneAndUpdate(

                        {

                            handle: socket.handle

                        },

                        {

                            isOnline: false,

                            lastSeen: new Date()

                        }

                    );

                } catch (err) {

                    console.error(
                        "[SOCKET] disconnect:",
                        err
                    );

                }

            }

        );

    

};

module.exports.closeRoom = closeRoom;

/* ==========================================
   Close Room
========================================== */

async function closeRoom(io, roomId) {

    try {

        const room = await Room.findById(roomId);

        if (!room) return;

        if (room.status === "closed") return;

        room.status = "closed";

        room.closedAt = new Date();

        await room.save();

        console.log(
            `[ROOM] Closed : ${room.roomNumber}`
        );

        /* ==========================================
           Apply Cooldowns
        ========================================== */

        try {

            await setCooldowns(room._id);

        }

        catch (error) {

            console.error(
                "[ROOM] Cooldown:",
                error
            );

        }

        /* ==========================================
           Notify Clients
        ========================================== */

        io.to(roomId).emit(
            "room_closed",
            {

                roomId:
                    room._id.toString(),

                roomNumber:
                    room.roomNumber,

                message:
                    "This conversation has ended."

            }
        );

        /* ==========================================
           Cleanup Timers
        ========================================== */

        if (
            countdownTimers.has(roomId)
        ) {

            clearTimeout(
                countdownTimers.get(roomId)
            );

            countdownTimers.delete(
                roomId
            );

        }

        if (
            roomCloseTimers.has(roomId)
        ) {

            clearTimeout(
                roomCloseTimers.get(roomId)
            );

            roomCloseTimers.delete(
                roomId
            );

        }

        console.log(
            `[ROOM] Cleanup Complete`
        );

    }

    catch (error) {

        console.error(
            "[ROOM] closeRoom:",
            error
        );

    }

}