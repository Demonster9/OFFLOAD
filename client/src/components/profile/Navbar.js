import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Navbar.css";

export default function Navbar() {

    const { logout } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (

        <nav className="navbar">

            <div className="navbar-logo">

                OFFLOAD

            </div>

            <div className="navbar-links">

                <Link
                    className={
                        location.pathname === "/home"
                            ? "active"
                            : ""
                    }
                    to="/home"
                >
                    Home
                </Link>

                <Link
                    className={
                        location.pathname === "/profile"
                            ? "active"
                            : ""
                    }
                    to="/profile"
                >
                    Profile
                </Link>

                <Link
                    className={
                        location.pathname === "/waiting"
                            ? "active"
                            : ""
                    }
                    to="/waiting"
                >
                    Discussion
                </Link>

            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >
                Logout
            </button>

        </nav>

    );

}