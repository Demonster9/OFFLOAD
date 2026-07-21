import api from "./api";

const register = async (data) => {

    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;

};

const getCurrentUser = async () => {

    const response = await api.get(
        "/auth/me"
    );

    return response.data;

};

const updateOnboarding = async (data) => {

    const response = await api.post(
        "/auth/onboarding",
        data
    );

    return response.data;

};

const authService = {

    register,

    getCurrentUser,

    updateOnboarding

};

export default authService;