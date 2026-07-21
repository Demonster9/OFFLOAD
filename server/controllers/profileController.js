const ProfileService = require("../services/ProfileService");

class ProfileController {

    async getMyProfile(req, res) {

        try {

            const profile =
                await ProfileService.getCurrentProfile(req.user._id);

            return res.json({
                success: true,
                profile
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async getProfile(req, res) {

        try {

            const profile =
                await ProfileService.getProfileById(req.params.id);

            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }

            return res.json({
                success: true,
                profile
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async updateProfile(req, res) {

        try {

            const profile =
                await ProfileService.updateProfile(
                    req.user._id,
                    req.body
                );

            return res.json({
                success: true,
                profile
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

}

module.exports = new ProfileController();