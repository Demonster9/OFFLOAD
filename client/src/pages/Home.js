import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";
import Navbar from "../components/profile/Navbar";

export default function Home() {

    const navigate = useNavigate();

    const { user } = useAuth();

    return (
        <>
         <Navbar />

        <div className="home-page">
            

            <div className="home-card">

                

                <div className="welcome-card">

                    <h2>
                        Welcome back 👋
                    </h2>

                    <h3>
                        {user?.handle}
                    </h3>

                    <p>
                        {user?.level} • {user?.stack}
                    </p>

                </div>

                <button
                    className="primary-btn"
                    onClick={() => navigate("/waiting")}
                >
                    Start Discussion →
                </button>

                <div className="stats-card">

                    <h3>Your Activity</h3>

                    <div className="stat">

                        <span>Rooms Joined</span>

                        <strong>
                            {user?.stats?.roomsJoined || 0}
                        </strong>

                    </div>

                    <div className="stat">

                        <span>Discussions</span>

                        <strong>
                            {user?.stats?.discussions || 0}
                        </strong>

                    </div>

                    <div className="stat">

                        <span>Projects Shared</span>

                        <strong>
                            {user?.stats?.projectsShared || 0}
                        </strong>

                    </div>

                </div>

                <div className="badge-card">

                    <h3>Badges</h3>

                    <p>
                        Coming Soon 🚀
                    </p>

                </div>

                <div className="actions">

                    <button
                        className="secondary-btn"
                        onClick={() => navigate("/profile")}
                    >
                        My Profile
                    </button>

                    

                </div>

            </div>

        </div>
 </>
    );

}