import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";

// This Settings page is specifically for SACCO Saver users.
// Only savers should access and use these settings.

const user = {
  name: "Kats Omar",
  accountNumber: "SACCO20250717001",
  avatar: "/assets/avatar.png",
  online: true,
  email: "katsomar@email.com",
  emailVerified: true,
  idVerified: false,
  phone: "+256700123456",
  phoneVerified: true,
};

const Settings = () => {
  const navigate = useNavigate();
  const [onlineStatus, setOnlineStatus] = useState(user.online);
  const [theme, setTheme] = useState("light");
  const [emailVerified, setEmailVerified] = useState(user.emailVerified);
  const [idVerified, setIdVerified] = useState(user.idVerified);
  const [phone, setPhone] = useState(user.phone);
  const [phoneVerified, setPhoneVerified] = useState(user.phoneVerified);
  const [threshold, setThreshold] = useState(50);
  const [reminder, setReminder] = useState("3");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <div className="scrollable-page">
      <div className="saver-dashboard">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-left">
            <div className="profile-viewer">
              <img src={user.avatar} alt="Avatar" className="avatar" />
              <span>{user.name}</span>
            </div>
          </div>
          <div className="navbar-center">
            <input
              type="text"
              className="search-bar"
              placeholder="Search groups or friends..."
            />
            <button className="discover-btn" onClick={() => navigate("/discover")}>
              Discover
            </button>
          </div>
          <div className="navbar-right">
            <button className="logout-btn" onClick={() => navigate("/login")}>
              Logout
            </button>
          </div>
        </nav>

        <div className="dashboard-body">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="online-status">
              <span className={`status-dot ${onlineStatus ? "online" : "offline"}`}></span>
              <span>{onlineStatus ? "Online" : "Offline"}</span>
            </div>
            <ul className="sidebar-menu">
              <li onClick={() => navigate("/deposit")}>Deposit</li>
              <li onClick={() => navigate("/withdraw")}>Withdraw</li>
              <li onClick={() => navigate("/notifications")}>Notifications</li>
              <li onClick={() => navigate("/chat")}>Chat</li>
              <li onClick={() => navigate("/settings")}>Settings</li>
            </ul>
            <div className="sidebar-logo">
              <img
                src="/src/assets/images/logo.png"
                alt="Trinity SACCO"
                style={{ filter: "grayscale(100%)", opacity: 0.65 }}
              />
              <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="settings-main">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 className="settings-title">Settings</h1>
              <button
                className="btn"
                style={{
                  background: "#e3e6ee",
                  color: "#004080",
                  fontWeight: 500,
                  borderRadius: "8px",
                  padding: "0.5rem 1.2rem",
                  fontSize: "1rem",
                  marginLeft: "auto"
                }}
                onClick={() => navigate("/saver-dashboard")}
              >
                Back to Dashboard
              </button>
            </div>

            {/* Identity & Verification */}
            <section className="settings-section">
              <h2>Identity & Verification</h2>
              <div className="settings-row">
                <label>Email</label>
                <div>
                  <span>{user.email}</span>
                  {emailVerified ? (
                    <span className="verified-icon" title="Verified">✔️</span>
                  ) : (
                    <span className="unverified-icon" title="Not Verified">❔</span>
                  )}
                  <button className="btn" style={{ marginLeft: "1rem" }} onClick={() => setEmailVerified(true)}>
                    Verify Email
                  </button>
                </div>
              </div>
              <div className="settings-row">
                <label>National ID</label>
                <div>
                  {idVerified ? (
                    <span className="verified-icon" title="Verified">✔️</span>
                  ) : (
                    <span className="unverified-icon" title="Not Verified">❔</span>
                  )}
                  <input type="file" className="settings-upload" />
                  <button className="btn" style={{ marginLeft: "1rem" }} onClick={() => setIdVerified(true)}>
                    Upload/Verify
                  </button>
                </div>
              </div>
            </section>
            <hr />

            {/* Contact Details */}
            <section className="settings-section">
              <h2>Contact Details</h2>
              <div className="settings-row">
                <label>Phone Number</label>
                <div>
                  <input
                    type="text"
                    className="settings-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    disabled={phoneVerified}
                  />
                  {phoneVerified ? (
                    <span className="verified-icon" title="Verified">✔️</span>
                  ) : (
                    <span className="unverified-icon" title="Not Verified">❔</span>
                  )}
                  <button className="btn" style={{ marginLeft: "1rem" }} onClick={() => setPhoneVerified(true)}>
                    {phoneVerified ? "Verified" : "Verify Number"}
                  </button>
                </div>
              </div>
            </section>
            <hr />

            {/* Password & Security */}
            <section className="settings-section">
              <h2>Password & Security</h2>
              <div className="settings-row">
                <label>Current Password</label>
                <input
                  type="password"
                  className="settings-input"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="settings-row">
                <label>New Password</label>
                <input
                  type="password"
                  className="settings-input"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div className="settings-row">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="settings-input"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="settings-row">
                <label>Online Visibility</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={onlineStatus}
                    onChange={() => setOnlineStatus(!onlineStatus)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-row">
                <button className="btn" style={{ marginTop: "0.5rem" }}>
                  Update Password
                </button>
              </div>
            </section>
            <hr />

            {/* Notification & Limits */}
            <section className="settings-section">
              <h2>Notification & Limits</h2>
              <div className="settings-row">
                <label>Minimum Balance Alert</label>
                <input
                  type="number"
                  className="settings-input"
                  value={threshold}
                  onChange={e => setThreshold(e.target.value)}
                  min={0}
                />
              </div>
              <div className="settings-row">
                <label>Reminder Interval (days)</label>
                <select
                  className="settings-input"
                  value={reminder}
                  onChange={e => setReminder(e.target.value)}
                >
                  <option value="1">Every 1 day</option>
                  <option value="3">Every 3 days</option>
                  <option value="7">Every week</option>
                </select>
              </div>
            </section>
            <hr />

            {/* Theme */}
            <section className="settings-section">
              <h2>Theme</h2>
              <div className="settings-row">
                <label>Light/Dark Mode</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </section>
            <hr />

            {/* Multi-device Access */}
            <section className="settings-section">
              <h2>Multi-device Access</h2>
              <div className="settings-row">
                <label>QR Code Login</label>
                <div className="qr-placeholder">
                  <div className="qr-box"></div>
                  <span className="qr-label">Scan this QR on another device to login</span>
                </div>
              </div>
              <div className="settings-row">
                <span className="qr-desc">
                  Enable multi-device login to access your account securely from multiple devices.
                </span>
              </div>
            </section>

            <div className="settings-actions">
              <button className="settings-undo-btn btn" onClick={() => alert("Undone!")}>
                Undo
              </button>
              <button className="settings-redo-btn btn" onClick={() => alert("Redone!")}>
                Redo
              </button>
              <button className="settings-save-btn btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </main>
        </div>
        {/* Footer */}

      </div>
    </div>
  );
};

export default Settings;
