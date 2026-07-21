const AuthService = require("../services/AuthService");

class AuthController {

    // ==========================================
    // Anonymous Registration
    // ==========================================

    async registerAnonymous(req, res) {
        try {

            const response = await AuthService.registerAnonymous(req.body);

            return res.status(201).json(response);

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    // ==========================================
    // Complete GitHub Onboarding
    // ==========================================

    async completeOnboarding(req, res) {
        try {

            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No token provided"
                });
            }

            const response = await AuthService.completeOnboarding(
                token,
                req.body
            );

            return res.json(response);

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    // ==========================================
    // Current User
    // ==========================================

    async getCurrentUser(req, res) {

        return res.status(200).json({
            success: true,
            user: req.user
        });

    }
// ==========================================
// Update Profile
// ==========================================

async updateProfile(req, res) {

    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "No token provided"
            });

        }

        const response =
            await AuthService.updateProfile(
                token,
                req.body
            );

        return res.json(response);

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
    // ==========================================
    // GitHub Login
    // ==========================================

    githubLogin(req, res) {
        // Passport handles this.
    }

    // ==========================================
    // GitHub Callback
    // ==========================================

    githubCallback(req, res) {

        const { token, needsOnboarding } =
            AuthService.githubCallback(req.user);

        return res.redirect(
  `${process.env.CLIENT_URL}/login?token=${token}&onboarding=${needsOnboarding}`
);
    }

}

module.exports = new AuthController();