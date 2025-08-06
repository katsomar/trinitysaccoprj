import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    birthday: "",
    address: "",
    avatar: "images/prof.png", // Default avatar path
  });
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost/server/profile.php", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          setProfile((prev) => ({
            ...prev,
            ...res.data.profile,
          }));

          if (res.data.profile && res.data.profile.profile_pic) {
            setPhoto(`http://localhost/server/images/${res.data.profile.profile_pic}`);
          } else {
            setPhoto(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("bio", profile.bio);
    formData.append("birthdate", profile.birthday);
    formData.append("address", profile.address);

    if (selectedPhotoFile) {
      formData.append("profilePhoto", selectedPhotoFile);
    }

    try {
      const res = await axios.post("http://localhost/server/update-profile.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        alert("Profile updated successfully!");
        if (res.data.profile_pic) {
          setPhoto(`http://localhost/server/images/${res.data.profile_pic}`);
        }
      } else {
        alert("Failed to save profile: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile.");
    }
  };

  const TopNav = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="profile-viewer" onClick={() => navigate("/profile")}>
          <img src={photo || "images/prof.png"} alt="Prof" className="avatar" />
          <span>{profile.name}</span>
        </div>
      </div>
      <div className="navbar-center">
        <input type="text" className="search-bar" placeholder="Search groups or friends..." />
        <button className="discover-btn" onClick={() => navigate("/discover")}>Discover</button>
      </div>
      <div className="navbar-right">
        <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
      </div>
    </nav>
  );

  const SideNav = () => (
    <aside className="sidebar">
      <div className="online-status">
        <span className="status-dot online"></span>
        <span>Online</span>
      </div>
      <ul className="sidebar-menu">
        <li onClick={() => navigate("/deposit")}>Deposit</li>
        <li onClick={() => navigate("/withdraw")}>Withdraw</li>
        <li onClick={() => navigate("/notifications")}>Notifications</li>
        <li onClick={() => navigate("/chat")}>Chat</li>
        <li onClick={() => navigate("/settings")}>Settings</li>
      </ul>
      <div className="sidebar-logo">
        <img src="/src/assets/images/logo.png" alt="Trinity SACCO" style={{ filter: "grayscale(100%)", opacity: 0.65 }} />
        <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
      </div>
    </aside>
  );

  return (
    <div className="profile-root scrollable-page">
      <TopNav />
      <div className="profile-main">
        <SideNav />
        <main className="profile-container">
          <div className="profile-header-row">
            <h1 className="profile-title">PROFILE</h1>
            <button
              className="btn"
              style={{
                background: "#e3e6ee",
                color: "#004080",
                fontWeight: 500,
                borderRadius: "8px",
                padding: "0.5rem 1.2rem",
                fontSize: "1rem",
                marginLeft: "auto",
              }}
              onClick={() => navigate("/saver-dashboard")}
            >
              Back to Dashboard
            </button>
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            {/* Profile Photo */}
            <section className="profile-card profile-photo-section">
              <label htmlFor="profile-photo-upload" className="profile-photo-label">
                <div className="profile-photo-wrapper">
                  <img src={photo || "images/prof.png"} alt="Profile" className="profile-photo" />
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoChange}
                  />
                  <button
                    type="button"
                    className="change-photo-btn"
                    onClick={() => document.getElementById("profile-photo-upload").click()}
                  >
                    Upload/Change Photo
                  </button>
                </div>
                <div className="profile-photo-hint">Click to upload/change photo</div>
              </label>
            </section>

            {/* Bio Section */}
            <section className="profile-card">
              <h2 className="section-title">User Bio</h2>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={profile.name} onChange={handleInput} required />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio/Description</label>
                <textarea id="bio" name="bio" value={profile.bio} onChange={handleInput} rows={3} />
              </div>
              <div className="form-group">
                <label htmlFor="birthday">Birthday</label>
                <input type="date" id="birthday" name="birthday" value={profile.birthday} onChange={handleInput} />
              </div>
            </section>

            {/* Contact Info */}
            <section className="profile-card">
              <h2 className="section-title">Contact Information</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={profile.email} onChange={handleInput} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleInput} required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea id="address" name="address" value={profile.address} onChange={handleInput} rows={2} />
              </div>
            </section>

            <div className="profile-save-row">
              <button type="submit" className="save-changes-btn">Save Changes</button>
            </div>
          </form>
        </main>
      </div>
      <footer className="footer">
        <span>&copy; 2024 Trinity SACCO. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Profile;
