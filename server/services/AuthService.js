const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateHandle = require("../utils/generateHandle");
const generateToken = require("../utils/jwt");

class AuthService {

    async registerAnonymous({ level, stack, intent }) {

        const handle = await generateHandle();

        const user = await User.create({
            handle,
            level,
            stack,
            intent,
            provider: "anonymous",
            onboardingDone: true
        });

        const token = generateToken(user);

        return {
            token,
            user: {
                id: user._id,
                handle: user.handle,
                level: user.level,
                stack: user.stack,
                intent: user.intent,
                onboardingDone: user.onboardingDone
            }
        };
    }

    async completeOnboarding(token, data) {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByIdAndUpdate(
            decoded.id,
            {
                level: data.level,
                stack: data.stack,
                intent: data.intent,
                onboardingDone: true
            },
            { new: true }
        );

        return {
            token,
            user: {
                id: user._id,
                handle: user.handle,
                level: user.level,
                stack: user.stack,
                intent: user.intent,
                onboardingDone: user.onboardingDone
            }
        };
    }

    async getCurrentUser(token) {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return await User.findById(decoded.id).select("-cooldowns");
    }

    async updateProfile(token, data) {

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );


// Check if handle already exists
const existingUser = await User.findOne({
    handle: data.handle
});

if (
    existingUser &&
    existingUser._id.toString() !== decoded.id
) {

    throw new Error(
        "This handle is already taken."
    );

}
    const user = await User.findByIdAndUpdate(

        decoded.id,

        {
    handle:data.handle,

    level:data.level,

    stack:data.stack,

    bio:data.bio,

    location:data.location,

    githubUsername:data.githubUsername,

    portfolio:data.portfolio,

    skills:data.skills
},

        {
            new: true
        }

    );

    return {

        success: true,

        user

    };

}

    githubCallback(user) {

        return {
            token: generateToken(user),
            needsOnboarding: !user.onboardingDone
        };
    }
}

module.exports = new AuthService();