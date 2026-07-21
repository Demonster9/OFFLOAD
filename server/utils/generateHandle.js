const User = require("../models/User");

const adjectives = [
    "Silent",
    "Quiet",
    "Calm",
    "Swift",
    "Brief",
    "North",
    "Dark",
    "Soft",
    "Still",
    "Sharp"
];

const nouns = [
    "Fox",
    "Owl",
    "Echo",
    "Wren",
    "Hawk",
    "Pine",
    "Mist",
    "Wolf",
    "Reed",
    "Lark"
];

const generateHandle = async () => {
    let handle;
    let exists = true;

    while (exists) {
        const adjective =
            adjectives[Math.floor(Math.random() * adjectives.length)];

        const noun =
            nouns[Math.floor(Math.random() * nouns.length)];

        const number = Math.floor(Math.random() * 100);

        handle = `${adjective}${noun}${number}`;

        exists = await User.exists({ handle });
    }

    return handle;
};

module.exports = generateHandle;