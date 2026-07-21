import { createContext, useContext, useEffect, useState } from "react";

import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        checkAuthentication();

    }, []);

    const checkAuthentication = async () => {

        try {

            const token = localStorage.getItem("offload_token");

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await authService.getCurrentUser();

            if (response.success) {
                setUser(response.user);
            } else {
                logout();
            }

        } catch (error) {

            logout();

        } finally {

            setLoading(false);

        }

    };

    const register = async (formData) => {

        const response = await authService.register(formData);

        if (response.token) {

            localStorage.setItem(
                "offload_token",
                response.token
            );

            setUser(response.user);

        }

        return response;

    };
    const updateUser = (updatedUser) => {

    setUser(updatedUser);

};

    const logout = () => {

        localStorage.removeItem("offload_token");

        setUser(null);

    };

    return (

        <AuthContext.Provider
    value={{
        user,
        loading,
        register,
        logout,
        updateUser,
        setUser
    }}
>

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);