import React, { useState } from 'react';
// Sidebar can be imported if available, else use a placeholder
import '../styles/GroupView.css';
import logo from '../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import InviteManager from './InviteManager';

const dummyUsers = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
  { id: 2, name: 'John Smith', email: 'john@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
];

const GroupView = () => {
  const navigate = useNavigate();
  const location = useLocation();
    const [group, setGroup] = useState(null);
  const [form, setForm] = useState({
    name: '',
    interest: '',
    period: '',
    description: '',
  });
  const [invites, setInvites] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('invite');

  // Dummy user for navbar
  const user = {
    name: "Manager Jane",
    avatar: "/assets/manager-avatar.png",
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    setGroup({
      ...form,
      created: '2024-06-01',
      members: 5,
      contributions: 1200000,
    });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
      return;
    }
    setSearchResults(
      dummyUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          u.email.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleInvite = (user) => {
    setInvites((prev) => [
      ...prev,
      { ...user, status: 'Pending' },
    ]);
    setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
  };

    return (
    <div className="saver-dashboard">
      {/* Navbar (Manager style) */}
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
        {/* Sidebar placeholder, replace with actual Sidebar if available */}
        <aside className="sidebar">
          <div className="online-status">
            <span className={`status-dot online`}></span>
            <span>Online</span>
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/members")}>Members</li>
            <li onClick={() => navigate("/transactions")}>Transactions</li>
            <li className={location.pathname === "/groups" ? "active" : ""} onClick={() => navigate("/groups")}>Groups</li>
            <li onClick={() => navigate("/interest-calculator")}>Interest Calculator</li>
            <li onClick={() => navigate("/reports")}>Reports</li>
            <li onClick={() => navigate("/manager-notifications")}>Manager Notifications</li>
            <li onClick={() => navigate("/messages")}>Messages</li>
            <li onClick={() => navigate("/manager-settings")}>Settings</li>
          </ul>
          <div className="sidebar-logo">
            <img src={logo} alt="Logo" style={{ filter: "grayscale(100%)", opacity: 0.65 }} />
            <span className="sidebar-logo-text">Powered by Omblo Technologies</span>
          </div>
        </aside>
        <main className="main-content groupview-main-content">
          <div className="groupview-header">
            <h1>Group Management</h1>
            <button className="btn groupview-back-btn" onClick={() => navigate('/manager-dashboard')}>Back to Dashboard</button>
          </div>
          {/* Tab Switcher */}
          <div className="groupview-tabs">
            <button
              className={`groupview-tab-btn${activeTab === 'invite' ? ' active' : ''}`}
              onClick={() => setActiveTab('invite')}
            >
              Invite Members
            </button>
            <button
              className={`groupview-tab-btn${activeTab === 'manage' ? ' active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              Manage Invites
            </button>
          </div>
          {/* Show group creation form only in Invite Members tab */}
          {activeTab === 'invite' && (
            <>
              <section className="groupview-form-card">
                <h2>Create a New Group</h2>
                <form className="groupview-form" onSubmit={handleCreateGroup}>
                  <label>
                    Group Name
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Interest Rate (%)
                    <input
                      type="number"
                      name="interest"
                      value={form.interest}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Period (e.g., 30 days)
                    <input
                      type="text"
                      name="period"
                      value={form.period}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      rows={3}
                      required
                    />
                  </label>
                  <button className="btn groupview-create-btn" type="submit">
                    Create Group
                  </button>
                </form>
              </section>
              <div style={{ height: '2.5rem' }} />
            </>
          )}
          <div className="groupview-grid">
            {activeTab === 'invite' && (
              <section className="groupview-invite-card">
                <div className="groupview-invite-header">
                  <span className="groupview-invite-header-icon" role="img" aria-label="invite">📨</span>
                  <span className="groupview-invite-header-title">Invite Members to Group</span>
                </div>
                <div className="groupview-search-wrapper">
                  <input
                    className="groupview-search"
                    type="text"
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={handleSearch}
                    disabled={!group}
                  />
                </div>
                <ul className="groupview-search-results">
                  {searchResults.map((user) => (
                    <li key={user.id}>
                      <span>{user.name} ({user.email})</span>
                      <button
                        className="btn groupview-invite-btn"
                        onClick={() => handleInvite(user)}
                      >
                        Invite to Group
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="groupview-invites-list">
                  <h3>Sent Invites</h3>
                  <ul>
                    {invites.length === 0 && <li>No invites sent yet.</li>}
                    {invites.map((invite) => (
                      <li key={invite.id}>
                        {invite.name} ({invite.email}) <span className="groupview-invite-status">{invite.status}</span>
                      </li>
                            ))}
                        </ul>
                </div>
              </section>
            )}
            {activeTab === 'manage' && (
              <section className="groupview-invite-card">
                <InviteManager />
              </section>
            )}
            {group && (
              <section className="groupview-info-card">
                <h2>Group Info</h2>
                <div className="groupview-info-row">
                  <span className="groupview-info-label">Group Name:</span>
                  <span>{group.name}</span>
                </div>
                <div className="groupview-info-row">
                  <span className="groupview-info-label">Total Members:</span>
                  <span>{group.members}</span>
                </div>
                <div className="groupview-info-row">
                  <span className="groupview-info-label">Total Contributions:</span>
                  <span>UGX {group.contributions.toLocaleString()}</span>
                </div>
                <div className="groupview-info-row">
                  <span className="groupview-info-label">Interest Rate:</span>
                  <span>{group.interest}%</span>
                </div>
                <div className="groupview-info-row">
                  <span className="groupview-info-label">Created Date:</span>
                  <span>{group.created}</span>
                </div>
              </section>
            )}
          </div>
        </main>
            </div>
        </div>
    );
};

export default GroupView;
