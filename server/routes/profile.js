const express = require("express");

const protect = require("../middleware/authMiddleware");

const ProfileController = require("../controllers/profileController");

const router = express.Router();

/* ==========================================
   Current User
========================================== */

router.get(
    "/me",
    protect,
    ProfileController.getMyProfile
);

/* ==========================================
   Update Profile
========================================== */

router.patch(
    "/",
    protect,
    ProfileController.updateProfile
);

/* ==========================================
   Public Profile
========================================== */

router.get(
    "/:id",
    protect,
    ProfileController.getProfile
);

module.exports = router;