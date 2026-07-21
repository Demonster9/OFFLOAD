const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        /* ==========================================
           Authentication
        ========================================== */

        handle: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        provider: {
            type: String,
            enum: ["github", "anonymous"],
            default: "anonymous"
        },

        providerId: {
            type: String,
            default: null
        },

        /* ==========================================
           Developer Profile
        ========================================== */

        displayName: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        avatar: {
            type: String,
            default: ""
        },

        githubUsername: {
            type: String,
            default: ""
        },

        githubProfile: {
            type: String,
            default: ""
        },

        portfolio: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        /* ==========================================
           Matching
        ========================================== */

        level: {
            type: String,
            enum: ["junior", "mid", "senior", "staff"],
            required: true
        },

        stack: {
            type: String,
            enum: [
                "frontend",
                "backend",
                "fullstack",
                "devops",
                "mobile"
            ],
            required: true
        },

        intent: {
            type: String,
            enum: ["vent", "listen", "both"],
            required: true
        },

        skills: {
            type: [String],
            default: []
        },

        interests: {
            type: [String],
            default: []
        },

        onboardingDone: {
            type: Boolean,
            default: false
        },

        /* ==========================================
           Presence
        ========================================== */

        isOnline: {
            type: Boolean,
            default: false
        },

        lastSeen: {
            type: Date,
            default: Date.now
        },

        /* ==========================================
           Reputation
        ========================================== */

        badges: {
            helpful: {
                type: Number,
                default: 0
            },

            creativeThinker: {
                type: Number,
                default: 0
            },

            problemSolver: {
                type: Number,
                default: 0
            },

            mentor: {
                type: Number,
                default: 0
            },

            teamPlayer: {
                type: Number,
                default: 0
            },

            communicator: {
                type: Number,
                default: 0
            }
        },

        /* ==========================================
           Statistics
        ========================================== */

        stats: {
            roomsJoined: {
                type: Number,
                default: 0
            },

            discussions: {
                type: Number,
                default: 0
            },

            projectsShared: {
                type: Number,
                default: 0
            }
        },

        /* ==========================================
           Cooldown
        ========================================== */

        cooldowns: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                until: {
                    type: Date
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);