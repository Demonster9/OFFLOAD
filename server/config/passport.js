const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/User");
const generateHandle = require("../utils/generateHandle");


/* ========================================
   GitHub Strategy
======================================== */

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, done) => {

            try {

                let user = await User.findOne({
                    provider: "github",
                    providerId: profile.id
                });

                if (user) {
                    return done(null, user);
                }

                const handle = await generateHandle();

                user = await User.create({

                    handle,

                    provider: "github",

                    providerId: profile.id,

                    level: "mid",

                    stack: "fullstack",

                    intent: "both",

                    onboardingDone: false

                });

                return done(null, user);

            } catch (error) {

                return done(error, null);

            }
        }
    )
);

/* ========================================
   Session
======================================== */

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {

    try {

        const user = await User.findById(id);

        done(null, user);

    }

    catch (error) {

        done(error, null);

    }

});

module.exports = passport;