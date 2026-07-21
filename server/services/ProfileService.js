const User = require("../models/User");

class ProfileService {

    async getCurrentProfile(userId) {

        return await User.findById(userId)
            .select("-cooldowns -providerId");
    }

    async getProfileById(userId) {

        return await User.findById(userId)
            .select("-cooldowns -providerId");
    }

    async updateProfile(userId, profileData) {

        const allowedFields = [
            "displayName",
            "bio",
            "portfolio",
            "location",
            "skills",
            "interests"
        ];

        const updates = {};

        allowedFields.forEach((field) => {

            if (profileData[field] !== undefined) {
                updates[field] = profileData[field];
            }

        });

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-cooldowns -providerId");

        return user;
    }

}

module.exports = new ProfileService();