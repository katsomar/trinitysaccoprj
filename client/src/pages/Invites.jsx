import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Invites.css';
import '../styles/GroupView.css';
import '../styles/transactions.css';
import Footer from '../components/Footer';
import SaverTopNav from '../components/SaverTopNav';

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
    message: 'Join us for a great saving experience! Feel free to ask any questions.',
    status: 'pending',
  },
  {
    id: 2,
    group: 'Market Vendors',
    manager: 'Manager Peter',
    date: '2024-07-14',
    message: 'We think you would be a great fit for our group.',
    status: 'pending',
  },
];

const mockRequests = [
  {
    id: 101,
    group: 'Family Fund',
    date: '2024-07-10',
    message: 'Looking to join and contribute monthly.',
    status: 'pending',
  },
  {
    id: 102,
    group: 'Holiday Club',
    date: '2024-07-08',
    message: 'I love the saving culture in this group.',
    status: 'declined',
  },
  {
    id: 103,
    group: 'Business Group',
    date: '2024-07-01',
    message: 'Interested in group saving for investment.',
    status: 'accepted',
  },
];

const Invites = () => {
  const [invites, setInvites] = useState(mockInvites);
  const [requests, setRequests] = useState(mockRequests);
  const [activeTab, setActiveTab] = useState('invites'); // 'invites' | 'requests'
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
    setInvites((prev) =>
      prev.map((invite) =>
        invite.id === id ? { ...invite, status: 'declined' } : invite
      )
    );
  };

  const handleCancelRequest = (id) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'cancelled' } : req))
    );
  };

  return (
    <div className="saver-dashboard">
      {/* Navbar */}
      <SaverTopNav />
      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="online-status">
            <span className={`status-dot ${user.online ? "online" : "offline"}`}></span>
            <span>{user.online ? "Online" : "Offline"}</span>
          </div>
          <ul className="sidebar-menu">
            <li className={location.pathname === "/deposit" ? "active" : ""} onClick={() => navigate("/deposit")}><span style={{ marginRight: '8px' }} role="img" aria-label="deposit">💰</span>Deposit</li>
            <li className={location.pathname === "/withdraw" ? "active" : ""} onClick={() => navigate("/withdraw")}><span style={{ marginRight: '8px' }} role="img" aria-label="withdraw">💸</span>Withdraw</li>
            <li className={location.pathname === "/notifications" ? "active" : ""} onClick={() => navigate("/notifications")}><span style={{ marginRight: '8px' }} role="img" aria-label="notifications">🔔</span>Notifications</li>
            <li className={location.pathname === "/chat" ? "active" : ""} onClick={() => navigate("/chat")}><span style={{ marginRight: '8px' }} role="img" aria-label="chat">💬</span>Chat</li>
            <li className={location.pathname === "/invites" ? "active" : ""} onClick={() => navigate("/invites")}><span style={{ marginRight: '8px' }} role="img" aria-label="invites">📩</span>Invites/Requests</li>
            <li className={location.pathname === "/settings" ? "active" : ""} onClick={() => navigate("/settings")}><span style={{ marginRight: '8px' }} role="img" aria-label="settings">⚙️</span>Settings</li>
          </ul>
          <div className="sidebar-logo">
            <img src="/src/assets/images/logo.png" alt="Trinity SACCO" style={{ filter: "grayscale(100%)", opacity: 0.65 }} />
            <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
          </div>
        </aside>
        <main className="main-content invites-main-content">
          <div className="invites-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h1 className="invites-title">Invites / Requests</h1>
            <button className="btn tx-back-btn" onClick={() => navigate('/saver-dashboard')}>Back to Dashboard</button>
          </div>

          {/* Tabs */}
          <div className="groupview-tabs">
            <button
              className={`groupview-tab-btn${activeTab === 'invites' ? ' active' : ''}`}
              onClick={() => setActiveTab('invites')}
            >
              Invites from groups
            </button>
            <button
              className={`groupview-tab-btn${activeTab === 'requests' ? ' active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests to groups
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'invites' ? (
            <div className="invites-list">
              {invites.length === 0 && (
                <div className="invites-fallback">You have no invites at the moment.</div>
              )}
              {invites.map((invite) => (
                <div className="invite-card" key={invite.id}>
                  <div className="invite-card-header">
                    <span className="invite-group">{invite.group}</span>
                    <span className={`invite-status ${invite.status}`}>{invite.status}</span>
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
          ) : (
            <div className="invites-list">
              {requests.length === 0 && (
                <div className="invites-fallback">You have not sent any requests.</div>
              )}
              {requests.map((req) => (
                <div className="invite-card" key={req.id}>
                  <div className="invite-card-header">
                    <span className="invite-group">{req.group}</span>
                    <span className={`invite-status ${req.status}`}>{req.status}</span>
                  </div>
                  <div className="invite-info">
                    <div><b>Date:</b> {req.date}</div>
                    {req.message && <div className="invite-message">{req.message}</div>}
                  </div>
                  {req.status === 'pending' && (
                    <div className="invite-actions">
                      <button className="btn decline-btn" onClick={() => handleCancelRequest(req.id)}>Cancel Request</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Invites; 