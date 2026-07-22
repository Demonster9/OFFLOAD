
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";
import Navbar from "../components/profile/Navbar";
import profileService from "../services/profileService";

export default function Profile() {

    
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);

const [formData, setFormData] = useState({

    handle: user?.handle || "",

    level: user?.level || "junior",

    stack: user?.stack || "fullstack",

    bio: user?.bio || "",

    location: user?.location || "",

    githubUsername: user?.githubUsername || "",

    portfolio: user?.portfolio || "",

    skills: user?.skills?.join(", ") || ""

});

const handleSave = async () => {

    try {

        const response =
            await profileService.updateProfile({

    handle: formData.handle,

    level: formData.level,

    stack: formData.stack,

    bio: formData.bio,

    location: formData.location,

    githubUsername: formData.githubUsername,

    portfolio: formData.portfolio,

    skills: formData.skills
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean)

});
        updateUser(response.profile);

        setEditing(false);

        alert("Profile Updated Successfully!");

    } catch (error) {

        console.error(error);

        alert("Unable to update profile.");

    }

};
    return (
         <>
         <Navbar />
        <div className="profile-page">
            

            <div className="profile-card">

                

                <div className="avatar">

                    {user?.handle?.charAt(0).toUpperCase()}

                </div>

                <h1>{user?.handle}</h1>

                <p className="role">

                    {user?.level} • {user?.stack}

                </p>

                <div className="section">

                    <h3>Bio</h3>

                    <p>

                        {user?.bio || "No bio added yet."}

                    </p>

                </div>

                <div className="section">

                    <h3>Location</h3>

                    <p>

                        {user?.location || "Not Added"}

                    </p>

                </div>

                <div className="section">

                    <h3>GitHub</h3>

                    <p>

                        {user?.githubUsername || "Not Connected"}

                    </p>

                </div>

                <div className="section">

                    <h3>Portfolio</h3>

                    <p>

                        {user?.portfolio || "Not Added"}

                    </p>

                </div>

                <div className="section">

                    <h3>Skills</h3>

                    <div className="chips">

                        {user?.skills?.length
                            ? user.skills.map(skill => (

                                <span
                                    key={skill}
                                    className="chip"
                                >
                                    {skill}
                                </span>

                            ))
                            :
                            <span className="empty">

                                No skills added

                            </span>
                        }

                    </div>

                </div>

                <button
    className="edit-btn"
    onClick={() => setEditing(true)}
>
    Edit Profile
</button>
{editing && (

<div className="edit-modal">

    <h2>Edit Profile</h2>
<input
    value={formData.handle}
    placeholder="Display Name"
    onChange={(e)=>
        setFormData({
            ...formData,
            handle:e.target.value
        })
    }
/>
<select
    value={formData.level}
    onChange={(e)=>
        setFormData({
            ...formData,
            level:e.target.value
        })
    }
>

<option value="junior">Junior Developer</option>
<option value="mid">Mid-Level Developer</option>
<option value="senior">Senior Developer</option>
<option value="staff">Staff / Lead Engineer</option>

</select>
<select
    value={formData.stack}
    onChange={(e)=>
        setFormData({
            ...formData,
            stack:e.target.value
        })
    }
>

<option value="frontend">Frontend</option>
<option value="backend">Backend</option>
<option value="fullstack">Full Stack</option>
<option value="devops">DevOps</option>
<option value="mobile">Mobile</option>

</select>
    <input
        value={formData.bio}
        placeholder="Bio"
        onChange={(e)=>
            setFormData({
                ...formData,
                bio:e.target.value
            })
        }
    />

    <input
        value={formData.location}
        placeholder="Location"
        onChange={(e)=>
            setFormData({
                ...formData,
                location:e.target.value
            })
        }
    />

    <input
        value={formData.githubUsername}
        placeholder="Github Username"
        onChange={(e)=>
            setFormData({
                ...formData,
                githubUsername:e.target.value
            })
        }
    />

    <input
        value={formData.portfolio}
        placeholder="Portfolio"
        onChange={(e)=>
            setFormData({
                ...formData,
                portfolio:e.target.value
            })
        }
    />

    <input
        value={formData.skills}
        placeholder="Java, React, Node"
        onChange={(e)=>
            setFormData({
                ...formData,
                skills:e.target.value
            })
        }
    />

    <div className="modal-buttons">

        <button
    className="edit-btn"
    onClick={handleSave}
>
    Save Changes
</button>

        <button
            className="cancel-btn"
            onClick={()=>setEditing(false)}
        >
            Cancel
        </button>

    </div>

</div>

)}

            </div>

        </div>
  </>
    );

}