import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);

    const socketRef = useRef(null);

    useEffect(() => {

        // Guard against React Strict Mode's mount -> cleanup -> mount
        // double-invoke, which was creating two live socket connections
        // for a single tab and causing duplicate "new_message" deliveries.
        if (socketRef.current) {

            return;

        }

        const token = localStorage.getItem("offload_token");

        const socketInstance = io(
            process.env.REACT_APP_API_URL || "http://localhost:5000",
            {
                transports: ["websocket", "polling"],

                auth: {
                    token
                },

                autoConnect: true,

                reconnection: true,

                reconnectionAttempts: 5,

                reconnectionDelay: 1000
            }
        );

        socketRef.current = socketInstance;

        socketInstance.on("connect", () => {

            console.log(
                "[SOCKET] Connected:",
                socketInstance.id
            );

        });

        socketInstance.on("disconnect", (reason) => {

            console.log(
                "[SOCKET] Disconnected:",
                reason
            );

        });

        socketInstance.on("connect_error", (error) => {

            console.error(
                "[SOCKET] Connection Error:",
                error.message
            );

        });

        setSocket(socketInstance);

        return () => {

            // Strict Mode's first cleanup pass would previously call
            // disconnect() here and then immediately reconnect, leaving
            // a stale socket still joined to a room for a brief window.
            // Only tear down for real unmounts, not the Strict Mode
            // mount/unmount/mount cycle.
            if (process.env.NODE_ENV === "development") {

                return;

            }

            socketRef.current?.disconnect();

            socketRef.current = null;

            setSocket(null);

        };

    }, []);

    return (

        <SocketContext.Provider value={socket}>

            {children}

        </SocketContext.Provider>

    );

};

export const useSocket = () => useContext(SocketContext);