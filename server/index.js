require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const socketIO = require("socket.io");

const connectDB = require("./config/db");
const passport = require("./config/passport");

// Routes
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const profileRoutes = require("./routes/profile");

// Socket Entry Point
const initializeSocket = require("./socket");

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:3000",
    process.env.CLIENT_URL
];
/* ==========================================
   Socket.IO Configuration
========================================== */

const io = socketIO(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["websocket", "polling"]
});
app.set("io", io);
/* ==========================================
   Global Middlewares
========================================== */

app.use(
    cors({
        origin: function (origin, callback) {

            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            callback(new Error("Not allowed by CORS"));

        },
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax"
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

/* ==========================================
   API Routes
========================================== */

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/profile", profileRoutes);

/* ==========================================
   Socket Initialization
========================================== */

initializeSocket(io);

/* ==========================================
   Health Check
========================================== */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "OFFLOAD",
        version: "1.0.0",
        status: "Running"
    });
});

/* ==========================================
   404 Handler
========================================== */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

/* ==========================================
   Global Error Handler (Temporary)
========================================== */

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

/* ==========================================
   Server
========================================== */

const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

server.listen(PORT, () => {
    console.log(`
==========================================
🚀 OFFLOAD Backend Started Successfully
==========================================
🌐 Server : http://localhost:${PORT}
📦 Environment : ${process.env.NODE_ENV}
==========================================
`);
});