import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Waiting.css";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

import roomService from "../services/roomService";

import SearchingAnimation from "../components/SearchingAnimation";
import ParticipantCard from "../components/ParticipantCard";
import Countdown from "../components/Countdown";
import ProgressDots from "../components/ProgressDots";


export default function Waiting() {

    const navigate = useNavigate();

    const socket = useSocket();

    const { user } = useAuth();

    const [room, setRoom] = useState(null);

    const [participantCount, setParticipantCount] = useState(0);

    const [countdown, setCountdown] = useState(120);

    const [countdownStarted, setCountdownStarted] = useState(false);

    const [status, setStatus] = useState("Searching Developers");

    const [error, setError] = useState("");

    const joinedRef = useRef(false);

    const timerRef = useRef(null);

    /* ==========================================
       Join Queue
    ========================================== */

    useEffect(() => {

        if (!socket) return;

        if (!user) return;

        if (joinedRef.current) return;

        joinedRef.current = true;

        async function joinQueue() {

            try {

                setStatus("Finding Developers");

                const existingRoom =
                    sessionStorage.getItem("offload_room");
                    if (
    window.performance &&
    window.performance.navigation &&
    window.performance.navigation.type === 1
) {

    sessionStorage.removeItem("offload_room");

}

                let roomData;

                if (existingRoom) {

                    try {

                        roomData =
    await roomService.getRoom(existingRoom);

if (roomData.status === "active") {

    sessionStorage.removeItem("offload_room");

    roomData = null;

}

                    }

                    catch {

                        sessionStorage.removeItem(
                            "offload_room"
                        );

                    }

                }

                if (!roomData) {

                    roomData =
                        await roomService.joinRoom();

                    sessionStorage.setItem(
                        "offload_room",
                        roomData.roomId
                    );

                }

                setRoom(roomData);

                setParticipantCount(
                    roomData.participantCount
                );
   console.log("JOIN_ROOM EMITTED");
                socket.emit("join_room", {

                    roomId: roomData.roomId,

                    handle: user.handle,

                    level: user.level,

                    stack: user.stack

                });

            }

            catch (err) {

                console.error(err);

                setError(
                    "Unable to connect to matchmaking."
                );

            }

        }

        joinQueue();

    }, [socket, user]);
        /* ==========================================
       Socket Events
    ========================================== */

    useEffect(() => {

        if (!socket) return;

        /* ---------- Room State ---------- */

        const onRoomState = (data) => {

            setRoom(data);

            setParticipantCount(
                data.participantCount
            );
/* ---------- Recover Countdown ---------- */

if (
    data.countdownStartedAt &&
    data.status === "waiting"
) {

    const started =
        new Date(data.countdownStartedAt);

    const now =
        new Date();

    const elapsed =
        Math.floor(
            (now - started) / 1000
        );

    const remaining =
        Math.max(
            120 - elapsed,
            0
        );

    setCountdown(remaining);

    setCountdownStarted(true);

    setStatus("Room Starting...");

}
            if (data.participantCount < 2) {

    setCountdownStarted(false);

    setCountdown(120);

}

            setStatus(
                data.status === "active"
                    ? "Room Active"
                    : "Waiting For Developers"
            );

            if (data.status === "active") {

                navigate(`/room/${data.roomId}`);

            }

        };

        /* ---------- User Joined ---------- */

        const onUserJoined = (data) => {

            setParticipantCount(
                data.participantCount
            );

        };

        /* ---------- User Left ---------- */

const onUserLeft = (data) => {

    setParticipantCount(
        data.participantCount
    );

    if (data.countdownCancelled) {

        clearInterval(
            timerRef.current
        );

        setCountdownStarted(false);

        setCountdown(120);

        setStatus(
            "Finding Developers"
        );

    }

};

        /* ---------- Countdown Started ---------- */

        const onCountdownStarted = (data) => {

            const started =
                new Date(data.countdownStartedAt);

            const now =
                new Date();

            const elapsed =
                Math.floor(
                    (now - started) / 1000
                );

            const remaining =
                Math.max(
                    data.duration - elapsed,
                    0
                );

            setCountdown(
                remaining
            );

            setCountdownStarted(
                true
            );

            setStatus(
                "Room Starting..."
            );

        };

        /* ---------- Room Started ---------- */

        const onRoomStarted = (data) => {

            setStatus(
                "Room Active"
            );

            sessionStorage.setItem(
                "offload_room",
                data.roomId
            );

            navigate(`/room/${data.roomId}`);

        };

        /* ---------- Room Closed ---------- */

        const onRoomClosed = (data) => {

            sessionStorage.removeItem(
                "offload_room"
            );

            setStatus(
                "Conversation Finished"
            );

            navigate(
                "/session"
            );

        };

        /* ---------- Room Error ---------- */

        const onRoomError = (data) => {

            setError(
                data.message
            );

        };

        socket.on(
            "room_state",
            onRoomState
        );

        socket.on(
            "user_joined",
            onUserJoined
        );
        socket.on(
    "user_left",
    onUserLeft
);
        socket.on(
            "countdown_started",
            onCountdownStarted
        );

        socket.on(
            "room_started",
            onRoomStarted
        );

        socket.on(
            "room_closed",
            onRoomClosed
        );

        socket.on(
            "room_error",
            onRoomError
        );

        return () => {

            socket.off(
                "room_state",
                onRoomState
            );

            socket.off(
                "user_joined",
                onUserJoined
            );
            
            socket.off(
    "user_left",
    onUserLeft
);
            socket.off(
                "countdown_started",
                onCountdownStarted
            );

            socket.off(
                "room_started",
                onRoomStarted
            );

            socket.off(
                "room_closed",
                onRoomClosed
            );

            socket.off(
                "room_error",
                onRoomError
            );

        };

    }, [socket, navigate]);

    /* ==========================================
       Countdown Timer
    ========================================== */

    useEffect(() => {

        if (!countdownStarted) return;

        timerRef.current = setInterval(() => {

            setCountdown((previous) => {

                if (previous <= 1) {

                    clearInterval(
                        timerRef.current
                    );

                    return 0;

                }

                return previous - 1;

            });

        }, 1000);

        return () => {

            clearInterval(
                timerRef.current
            );

        };

    }, [countdownStarted]);

    /* ==========================================
       Cancel Search
    ========================================== */

    const handleCancel = async () => {

        try {

            if (room?.roomId) {

                socket.emit(
                    "leave_room",
                    {

                        roomId:
                            room.roomId,

                        handle:
                            user.handle

                    }
                );

                await roomService.leaveRoom(
                    room.roomId
                );

            }

        }

        catch (error) {

            console.error(error);

        }

        sessionStorage.removeItem("offload_room");
        

        navigate("/home");

    };
        return (

        <div className="waiting-page">

            <div className="waiting-card">

                <h2 className="waiting-title">
    Finding Developers...
</h2>

<p className="waiting-subtitle">
    We're matching you with developers who have a similar experience level.
</p>

                <SearchingAnimation />

                <div className="participant-grid">

                    {

                        Array.from({ length: 6 }).map((_, index) => (

                            <ParticipantCard

                                key={index}

                                index={index}

                                joined={index < participantCount}

                            />

                        ))

                    }

                </div>

                <h2 className="participant-count">

                    {participantCount} / 6 Developers Joined

                </h2>

                {

                    countdownStarted && (

                        <>

                            <p className="countdown-title">

    Discussion begins in

</p>
                            <Countdown

                                seconds={countdown}

                            />

                        </>

                    )

                }

                <ProgressDots

                    current={participantCount}

                    total={6}

                />

                {

                    room && (

                        <div className="room-details">

    <div>

        <strong>

            Room #{room.roomNumber}

        </strong>

    </div>

    <div>

        <span>

            {status}

        </span>

    </div>

</div>

                    )

                }

                {

                    error && (

                        <div className="error-box">

                            {error}

                        </div>

                    )

                }

                <button

                    className="cancel-button"

                    onClick={handleCancel}

                >

                    Leave Queue

                </button>

            </div>

        </div>

    );

}