import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Onboarding from "../pages/Onboarding";
import Waiting from "../pages/Waiting";
import Room from "../pages/Room";
import PostSession from "../pages/PostSession";

import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function RoomRoute() {

    const navigate = useNavigate();

    const handleSessionEnd = () => {

        navigate("/session");

    };

    return (

        <Room onSessionEnd={handleSessionEnd} />

    );

}

export default function AppRoutes() {
const { user } = useAuth();
    return (
        <BrowserRouter>

            <Routes>


                <Route
                    path="/login"
                    element={<Onboarding />}
                />
<Route
    path="/home"
    element={
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    }
/>
<Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>
                <Route
                    path="/waiting"
                    element={
                        <ProtectedRoute>
                            <Waiting />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/room/:roomId"
                    element={
                        <ProtectedRoute>
                            <RoomRoute />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/session"
                    element={
                        <ProtectedRoute>
                            <PostSession />
                        </ProtectedRoute>
                    }
                />
             <Route
    path="*"
    element={
        <Navigate
            to={user ? "/home" : "/login"}
            replace
        />
    }
/>
    

                 

            </Routes>

        </BrowserRouter>
    );
}