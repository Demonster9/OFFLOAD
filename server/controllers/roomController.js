const RoomService = require("../services/RoomService");
const { closeRoom } = require("../socket/roomSocket");

class RoomController {

    // ==========================================
    // Join Room
    // ==========================================

    async joinRoom(req, res) {

        try {

            const response = await RoomService.joinRoom(req.user._id);

            return res.status(200).json(response);

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    // ==========================================
    // Get Room Details
    // ==========================================

    async getRoom(req, res) {

        try {

            const response = await RoomService.getRoom(req.params.id);

            return res.status(200).json(response);

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    // ==========================================
    // Close Room
    // ==========================================

    
async closeRoom(req, res) {
        try {
            const io = req.app.get("io");

            await closeRoom(io, req.params.id);

            return res.status(200).json({
                success: true,
                message: "Room closed"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

    }

}

module.exports = new RoomController();