const mongoose = require("mongoose");

/* ==========================================
   Participant Schema
========================================== */

const participantSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        handle: {
            type: String,
            required: true
        },

        // Anonymous name shown inside room
        anonymousName: {
            type: String,
            default: ""
        },

        level: {
            type: String,
            enum: ["junior", "mid", "senior", "staff"],
            required: true
        },

        stack: {
            type: String,
            required: true
        },

        joinedAt: {
            type: Date,
            default: Date.now
        },

        revealed: {
            type: Boolean,
            default: false
        }
    },
    { _id: false }
);

/* ==========================================
   Room Schema
========================================== */

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: Number,
            required: true,
            unique: true
        },

        status: {
            type: String,
            enum: [
                "waiting",
                "active",
                "closed"
            ],
            default: "waiting"
        },

        intent: {
            type: String,
            default: ""
        },

        stack: {
            type: String,
            default: ""
        },

        prompt: {
            type: String,
            default: ""
        },

        participants: {
            type: [participantSchema],
            default: []
        },

        maxParticipants: {
            type: Number,
            default: 6
        },

        minimumParticipants: {
            type: Number,
            default: 2
        },

        startedAt: {
            type: Date
        },

        closedAt: {
            type: Date
        },

        countdownStartedAt: {
            type: Date,
            default: null
        },

        /* ==========================================
           Identity Reveal
        ========================================== */

        revealVoting: {
            enabled: {
                type: Boolean,
                default: false
            },

            votes: [
                {
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    },

                    accepted: Boolean
                }
            ]
        },

        /* ==========================================
           Session Statistics
        ========================================== */

        totalMessages: {
            type: Number,
            default: 0
        },

        totalReactions: {
            type: Number,
            default: 0
        },

        durationMinutes: {
            type: Number,
            default: 60
        }
    },
    {
        timestamps: true
    }
);

/* ==========================================
   Indexes
========================================== */

roomSchema.index({
    status: 1,
    intent: 1,
    stack: 1
});


module.exports = mongoose.model("Room", roomSchema);