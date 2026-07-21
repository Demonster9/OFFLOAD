import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import roomService from "../services/roomService";
import '../styles/Room.css';

const ROOM_MINUTES = 60;

const SpeakingWave = () => (
  <div className="speaking-wave">
    <div className="speaking-wave-bar" />
    <div className="speaking-wave-bar" />
    <div className="speaking-wave-bar" />
    <div className="speaking-wave-bar" />
  </div>
);

export default function Room({ roomData, onSessionEnd }) {
  const { user } = useAuth();
  const socket = useSocket();
  const [room, setRoom] = useState(roomData || null);
  const [participants, setParticipants] = useState(roomData?.participants || []);
  const [speaking, setSpeaking] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(ROOM_MINUTES * 60);
  const [floats, setFloats] = useState([]);
  const chatRef = useRef(null);
  const timerRef = useRef(null);
  const listenersRegistered = useRef(false);
  const roomRef = useRef(room);
  const closedRef = useRef(false);

  const totalSeconds = ROOM_MINUTES * 60;
  const pct = (timeLeft / totalSeconds) * 100;
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');

  // Keep a ref of the latest room so socket/timer callbacks never read a stale closure
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  // Room recovery (initial mount + used again on reconnect)
  const recoverRoom = useCallback(async () => {
    if (roomData?.roomId) {
      setRoom(roomData);
      setParticipants(roomData.participants || []);
      return;
    }

    const roomId = sessionStorage.getItem("offload_room");

    if (!roomId) return;

    try {
      const data = await roomService.getRoom(roomId);
      setRoom(data);
      setParticipants(data.participants || []);
    } catch (err) {
      console.error(err);
    }
  }, [roomData]);

  useEffect(() => {
    recoverRoom();
  }, [recoverRoom]);

  // Guarantees onSessionEnd fires exactly once, whichever path triggers it
  // (manual close, timer expiry, or a room_closed event from the server).
  const finalizeClose = useCallback((closedRoom) => {
    if (closedRef.current) return;
    closedRef.current = true;

    clearInterval(timerRef.current);
    sessionStorage.removeItem("offload_room");

    onSessionEnd({
      roomData: closedRoom || roomRef.current
    });
  }, [onSessionEnd]);

  const handleLeaveRoom = useCallback(() => {

    if (!socket || !roomRef.current) return;

    socket.emit("leave_room", {
        roomId: roomRef.current.roomId,
        handle: user?.handle
    });

    finalizeClose(roomRef.current);

}, [socket, user?.handle, finalizeClose]);

  // Stable ref to latest handleClose so the timer effect (mount-only)
  // never invokes a stale version of the callback.
  const handleLeaveRoomRef = useRef(handleLeaveRoom);
  useEffect(() => {
    handleLeaveRoomRef.current = handleLeaveRoom;
  }, [handleLeaveRoom]);

  // Timer — logic unchanged, only made safe against stale closures
  useEffect(() => {
    timerRef.current = setInterval(() => {
    setTimeLeft(t => {
        if (t <= 1) {
            clearInterval(timerRef.current);
            return 0;
        }
        return t - 1;
    });
}, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Socket events
  useEffect(() => {
    if (!socket || listenersRegistered.current) return;
    listenersRegistered.current = true;

    const onRoomState = (data) => {

    setRoom(data);

    setParticipants(data.participants || []);

    setSpeaking({});

    // Recover countdown if it already started
    if (data.countdownStartedAt) {

        clearInterval(timerRef.current);

        const started =
            new Date(data.countdownStartedAt).getTime();

        timerRef.current = setInterval(() => {

            const remaining = Math.max(
                0,
                120 -
                Math.floor(
                    (Date.now() - started) / 1000
                )
            );

            setTimeLeft(remaining);

            if (remaining <= 0) {

                clearInterval(timerRef.current);

            }

        }, 1000);

    }

};
const onCountdownStarted = ({
    countdownStartedAt,
    duration
}) => {

    clearInterval(timerRef.current);

    const started =
        new Date(countdownStartedAt).getTime();

    timerRef.current = setInterval(() => {

        const remaining = Math.max(
            0,
            duration -
            Math.floor(
                (Date.now() - started) / 1000
            )
        );

        setTimeLeft(remaining);

        if (remaining <= 0) {

            clearInterval(timerRef.current);

        }

    }, 1000);

};

    const onUserJoined = ({ handle, level, stack }) => {
      setParticipants(prev => {
        if (prev.find(p => p.handle === handle)) return prev;
        return [...prev, { handle, level, stack }];
      });
      setMessages(prev => [...prev, { system: true, text: `${handle} joined` }]);
    };

    const onUserLeft = ({ handle }) => {
      setParticipants(prev => prev.filter(p => p.handle !== handle));
      setMessages(prev => [...prev, { system: true, text: `${handle} left` }]);
      setSpeaking(prev => {
        if (!(handle in prev)) return prev;
        const next = { ...prev };
        delete next[handle];
        return next;
      });
    };

    const onUserSpeaking = ({ handle, isSpeaking }) => {
      setSpeaking(prev => ({ ...prev, [handle]: isSpeaking }));
    };

 const onNewMessage = ({ handle, message }) => {

    console.log("SOCKET ID:", socket.id);

    console.log("MESSAGE:", message);

    console.trace("NEW_MESSAGE");

    setMessages(prev => [
        ...prev,
        {
            handle,
            message,
            isMe: handle === user?.handle
        }
    ]);
};
    const onNewReaction = ({ handle, emoji }) => {
      const id = `${Date.now()}-${Math.random()}`;
      setFloats(prev => [...prev, { id, emoji, x: Math.random() * 60 + 20 }]);
      setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1500);
    };

    const onRoomClosed = () => {
      finalizeClose(roomRef.current);
    };

    const onConnect = () => {
      // Reconnect support: re-sync room + participants after a dropped connection
      recoverRoom();
    };

    socket.on("room_state", onRoomState);
    socket.on(
    "countdown_started",
    onCountdownStarted
);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('user_speaking', onUserSpeaking);
    socket.on('new_message', onNewMessage);
    socket.on('new_reaction', onNewReaction);
    socket.on("room_closed", onRoomClosed);
    socket.on('connect', onConnect);

    return () => {
      socket.off("room_state", onRoomState);
      socket.off(
    "countdown_started",
    onCountdownStarted
);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('user_speaking', onUserSpeaking);
      socket.off('new_message', onNewMessage);
      socket.off('new_reaction', onNewReaction);
      socket.off('room_closed', onRoomClosed);
      socket.off('connect', onConnect);
      listenersRegistered.current = false;
    };
  }, [socket, user?.handle, finalizeClose, recoverRoom]);

  // Auto scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendReaction = (emoji) => {
    if (!socket) return;
    socket.emit('reaction', { roomId: room?.roomId, handle: user?.handle, emoji });
  };

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    console.log("SEND_MESSAGE EMITTED");
    socket.emit('send_message', {
      roomId: room?.roomId,
      handle: user?.handle,
      message: input.trim()
    });
    // Duplicate insert removed — the server's 'new_message' broadcast
    // (which the sender also receives) is now the single source of truth.
    setInput('');
  };

  return (
    <div className="room-page">
      {floats.map(f => (
        <div
          key={f.id}
          className="float-reaction"
          style={{ left: `${f.x}%` }}
        >
          {f.emoji}
        </div>
      ))}

      <div className="room-header">
        <div className="header-left">
          <h2 className="room-title">

    Discussion Room

</h2>
          <span className="room-tag">room #{room?.roomNumber} · {user?.level}</span>
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
        </div>
        <div className="timer-wrap">
          <div className="timer-bar">
            <div
              className="timer-fill"
              data-low={pct < 20}
              style={{ '--pct': pct }}
            />
          </div>
          <div className="timer-text">{mins}:{secs}</div>
        </div>
      </div>

      <div className="prompt-card">
        <h3 className="prompt-heading">

    Today's Prompt

</h3>
        <p className="prompt-text">"{room?.prompt}"</p>
      </div>

      <div className="participants-list">
        {participants.map((p, i) => (
          <div
            key={i}
            className={`participant-item${speaking[p.handle] ? ' is-speaking' : ''}`}
          >
           <div className="participant-handle">
    🟢 {p.handle}
</div>
            <div className="participant-meta">{p.level} · {p.stack}</div>
            {speaking[p.handle]
              ? <SpeakingWave />
              : <span className="mic-icon">🎙</span>
            }
          </div>
        ))}
      </div>

      <div className="reactions-row">
        {['👍', '♥', '😄', '🔥'].map(e => (
          <button key={e} className="reaction-btn" onClick={() => sendReaction(e)}>
            {e}
          </button>
        ))}
      </div>

      <div className="chat-area" ref={chatRef}>

    {messages.length === 0 ? (

        <div className="empty-chat">

            <h3>
                Start the conversation 👋
            </h3>

            <p>
                Introduce yourself or answer today's prompt.
            </p>

        </div>

    ) : (

        messages.map((m, i) => (

            m.system ? (

                <div
                    key={i}
                    className="system-message"
                >
                    {m.text}
                </div>

            ) : (

                <div
                    key={i}
                    className={`chat-row ${m.isMe ? "me" : "other"}`}
                >

                    <div className="chat-bubble">

                        <span className="chat-handle">
                            {m.handle}
                        </span>

                        {m.message}

                    </div>

                </div>

            )

        ))

    )}

</div>
      <div className="input-row">
        <input
          className="message-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Share your thoughts..."
        />
        <button className="send-btn" onClick={sendMessage}>↑</button>
        <button
    className="leave-btn"
    onClick={handleLeaveRoom}
>
    Leave Discussion
</button>
      </div>
    </div>
  );
}