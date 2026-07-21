const express = require("express");
const passport = require("../config/passport");

const AuthController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* ==========================================
   Anonymous Authentication
========================================== */

router.post(
    "/register",
    AuthController.registerAnonymous
);

/* ==========================================
   GitHub Onboarding
========================================== */

router.post(
    "/onboarding",
    AuthController.completeOnboarding
);

/* ==========================================
   Current User
========================================== */

router.get(
    "/me",
    protect,
    AuthController.getCurrentUser
);
router.put(
    "/profile",
    protect,
    AuthController.updateProfile
);

/* ==========================================
   GitHub OAuth Login
========================================== */

router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"]
    })
);

/* ==========================================
   GitHub OAuth Callback
========================================== */

router.get(
    "/github/callback",
    (req, res, next) => {
        console.log("✅ Callback route reached");
        console.log(req.query);
        next();
    },

    passport.authenticate("github", {
        failureRedirect: "/failed",
        session: true
    }),

    (req, res) => {
        console.log("✅ Passport Success");
        console.log(req.user);

        AuthController.githubCallback(req, res);
    }
);

router.get("/failed", (req, res) => {
    res.json({
        success: false,
        message: "Passport Authentication Failed"
    });
});
module.exports = router;