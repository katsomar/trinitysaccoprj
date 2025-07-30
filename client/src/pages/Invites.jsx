import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Invites.css';
import Footer from '../components/Footer';

const user = {
  name: "Kats Omar",
  accountNumber: "SACCO20250717001",
  avatar: "/assets/avatar.png",
  online: true,
};

const mockInvites = [
  {
    id: 1,
    group: 'School Savers',
    manager: 'Jane Doe',
    date: '2024-07-15',
    message: 'Join us for a great saving experience!',
    status: 'pending',
  },
  {
    id: 2,
    group: 'Market Vendors',
    manager: 'manager2@example.com',
    date: '2024-07-14',
    message: '',
    status: 'pending',
  },
];

const Invites = () => {
  const [invites, setInvites] = useState(mockInvites);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccept = (id) => {
    setInvites((prev) =>
      prev.map((invite) =>
        invite.id === id ? { ...invite, status: 'accepted' } : invite
      )
    );
  };

  const handleDecline = (id) => {
    setInvites((prev) => prev.filter((invite) => invite.id !== id));
  };

  return (
    <div className="saver-dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="profile-viewer" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
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
          <button className="discover-btn" onClick={() => navigate("/discover")}>Discover</button>
        </div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="online-status">
            <span className={`status-dot ${user.online ? "online" : "offline"}`}></span>
            <span>{user.online ? "Online" : "Offline"}</span>
          </div>
          <ul className="sidebar-menu">
            <li className={location.pathname === "/deposit" ? "active" : ""} onClick={() => navigate("/deposit")}>Deposit</li>
            <li className={location.pathname === "/withdraw" ? "active" : ""} onClick={() => navigate("/withdraw")}>Withdraw</li>
            <li className={location.pathname === "/notifications" ? "active" : ""} onClick={() => navigate("/notifications")}>Notifications</li>
            <li className={location.pathname === "/chat" ? "active" : ""} onClick={() => navigate("/chat")}>Chat</li>
            <li className={location.pathname === "/invites" ? "active" : ""} onClick={() => navigate("/invites")}>Invites</li>
            <li className={location.pathname === "/settings" ? "active" : ""} onClick={() => navigate("/settings")}>Settings</li>
          </ul>
          <div className="sidebar-logo">
            <img src="/src/assets/images/logo.png" alt="Trinity SACCO" style={{ filter: "grayscale(100%)", opacity: 0.65 }} />
            <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
          </div>
        </aside>
        <main className="main-content invites-main-content">
          <div className="invites-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 className="invites-title">Group Invitations</h1>
            <button className="btn groupview-back-btn" onClick={() => navigate('/saver-dashboard')}>Back to Dashboard</button>
          </div>
          <div className="invites-list">
            {invites.length === 0 && (
              <div className="invites-fallback">You have no pending invites at the moment.</div>
            )}
            {invites.map((invite) => (
              <div className="invite-card" key={invite.id}>
                <div className="invite-card-header">
                  <span className="invite-group">{invite.group}</span>
                  {invite.status === 'accepted' && (
                    <span className="invite-status accepted">Accepted</span>
                  )}
                </div>
                <div className="invite-info">
                  <div><b>Manager:</b> {invite.manager}</div>
                  <div><b>Date:</b> {invite.date}</div>
                  {invite.message && <div className="invite-message">{invite.message}</div>}
                </div>
                {invite.status === 'pending' && (
                  <div className="invite-actions">
                    <button className="btn accept-btn" onClick={() => handleAccept(invite.id)}>Accept</button>
                    <button className="btn decline-btn" onClick={() => handleDecline(invite.id)}>Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Invites; 