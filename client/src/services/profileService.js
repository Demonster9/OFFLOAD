import api from "./api";

const updateProfile = async (data) => {

    const response = await api.put(
        "/auth/profile",
        data
    );

    return response.data;

};

export default {

    updateProfile

};