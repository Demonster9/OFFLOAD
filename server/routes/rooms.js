const express = require("express");

const protect = require("../middleware/authMiddleware");
const RoomController = require("../controllers/roomController");

const router = express.Router();

/* ==========================================
   Join Room
========================================== */

router.post(
    "/join",
    protect,
    RoomController.joinRoom
);

/* ==========================================
   Get Room
========================================== */

router.get(
    "/:id",
    protect,
    RoomController.getRoom
);

/* ==========================================
   Close Room
========================================== */

router.post(
    "/:id/close",
    protect,
    RoomController.closeRoom
);

module.exports = router;