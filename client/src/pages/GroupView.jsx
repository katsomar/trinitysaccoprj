import React, { useState } from 'react';
import '../styles/GroupView.css';
import logo from '../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import InviteManager from './InviteManager';
import Footer from '../components/Footer';
import ManagerTopNav from '../components/ManagerTopNav';

const dummyUsers = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
  { id: 2, name: 'John Smith', email: 'john@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 4, name: 'Bob Lee', email: 'bob@example.com' },
  { id: 5, name: 'Mary Ann', email: 'mary@example.com' },
];

const dummyGroups = [
  { id: 'g1', name: 'Education Fund' },
  { id: 'g2', name: 'Business Group' },
  { id: 'g3', name: 'Holiday Club' },
];

function Modal({ isOpen, onClose, children, width = 400 }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content slide-down" style={{ maxWidth: width }}>
        {children}
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.38); backdrop-filter: blur(2px);
          z-index: 2000; display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s;
        }
        .modal-content {
          background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.22);
          padding: 2.2rem 2.7rem 2rem 2.7rem; min-width: 340px; max-width: 95vw; text-align: center; position: relative;
          animation: slideDown 0.33s cubic-bezier(.4,1.4,.6,1);
          transition: box-shadow 0.2s;
        }
        .modal-content h2 {
          font-size: 1.45rem;
          font-weight: 700;
          margin-bottom: 1.2rem;
          color: #004080;
          letter-spacing: 0.5px;
        }
        .modal-input, .groupview-modal-select, textarea {
          width: 100%;
          padding: 0.7rem 1rem;
          border-radius: 8px;
          border: 1.5px solid #e3e6ee;
          font-size: 1.08rem;
          margin-bottom: 1.1rem;
          background: #f7f9fc;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .modal-input:focus, .groupview-modal-select:focus, textarea:focus {
          border: 1.5px solid #007bff;
          outline: none;
          box-shadow: 0 0 0 2px #e3e6ff;
        }
        .modal-close-btn {
          position: absolute; top: 10px; right: 18px; background: none; border: none; font-size: 2.1rem; color: #888; cursor: pointer;
          transition: color 0.18s;
        }
        .modal-close-btn:hover {
          color: #dc3545;
        }
        .btn {
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.55rem 1.3rem;
          font-weight: 600;
          font-size: 1.05rem;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .btn:disabled {
          background: #b3c6e0;
          cursor: not-allowed;
        }
        .btn:hover:not(:disabled) {
          background: #0056b3;
        }
        .modal-error {
          color: #dc3545;
          margin-bottom: 0.7rem;
          font-size: 1.08rem;
        }
        .modal-search-results {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0.5rem 0;
          text-align: left;
        }
        .modal-search-results li {
          padding: 0.5rem 0.7rem;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.15s;
        }
        .modal-search-results li:hover {
          background: #f0f6ff;
        }
        .modal-user-tag {
          background: #e3e6ee;
          color: #004080;
          border-radius: 16px;
          padding: 0.3rem 0.9rem 0.3rem 0.8rem;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          margin-right: 0.2rem;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState('invite');

  // Invite flow state
  const [inviteStep, setInviteStep] = useState(0); // 0=none, 1=group, 2=pwd, 3=form
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [invitePwd, setInvitePwd] = useState('');
  const [invitePwdError, setInvitePwdError] = useState('');
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteResults, setInviteResults] = useState([]);
  const [inviteSelected, setInviteSelected] = useState([]);
  const [inviteMsg, setInviteMsg] = useState('');

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

  // Invite flow handlers
  function openInviteFlow() {
    setInviteStep(1);
    setSelectedGroupId('');
    setSelectedGroupName('');
    setInvitePwd('');
    setInvitePwdError('');
    setInviteSearch('');
    setInviteResults([]);
    setInviteSelected([]);
    setInviteMsg('');
  }
  function closeAllModals() {
    setInviteStep(0);
    setInvitePwd('');
    setInvitePwdError('');
    setInviteSearch('');
    setInviteResults([]);
    setInviteSelected([]);
    setInviteMsg('');
  }
  function handleGroupSelect(e) {
    setSelectedGroupId(e.target.value);
    const g = dummyGroups.find(g => g.id === e.target.value);
    setSelectedGroupName(g ? g.name : '');
  }
  function handleGroupConfirm() {
    if (!selectedGroupId) return;
    setInviteStep(2);
  }
  function handlePwdConfirm() {
    if (!invitePwd) {
      setInvitePwdError('Password required');
      return;
    }
    setInviteStep(3);
    setInvitePwdError('');
  }
  function handleInviteSearch(e) {
    setInviteSearch(e.target.value);
    if (e.target.value.trim() === '') {
      setInviteResults([]);
      return;
    }
    setInviteResults(
      dummyUsers.filter(
        (u) =>
          (u.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            u.email.toLowerCase().includes(e.target.value.toLowerCase())) &&
          !inviteSelected.some(sel => sel.id === u.id)
      )
    );
  }
  function handleAddInviteUser(user) {
    setInviteSelected(prev => [...prev, user]);
    setInviteResults(prev => prev.filter(u => u.id !== user.id));
    setInviteSearch('');
  }
  function handleRemoveInviteUser(user) {
    setInviteSelected(prev => prev.filter(u => u.id !== user.id));
  }
  function handleSendInvites() {
    // Simulate sending
    console.log('Inviting to group:', selectedGroupId);
    console.log('Users:', inviteSelected);
    console.log('Message:', inviteMsg);
    closeAllModals();
    alert('Invitations sent!');
  }

  return (
    <div className="saver-dashboard">
      {/* Navbar (Manager style) */}
      <ManagerTopNav />
      <div className="dashboard-body">
        {/* Sidebar placeholder, replace with actual Sidebar if available */}
        <aside className="sidebar">
          <div className="online-status">
            <span className={`status-dot online`}></span>
            <span>Online</span>
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/members")}><span style={{ marginRight: '8px' }} role="img" aria-label="members">👥</span>Members</li>
            <li onClick={() => navigate("/manager-transactions")}><span style={{ marginRight: '8px' }} role="img" aria-label="transactions">💳</span>Transactions</li>
            <li className={location.pathname === "/groups" ? "active" : ""} onClick={() => navigate("/groups")}><span style={{ marginRight: '8px' }} role="img" aria-label="groups">🗂️</span>Groups</li>
            <li onClick={() => navigate("/interest-calculator")}><span style={{ marginRight: '8px' }} role="img" aria-label="calculator">🧮</span>Interest Calculator</li>
            <li onClick={() => navigate("/reports")}><span style={{ marginRight: '8px' }} role="img" aria-label="reports">📊</span>Reports</li>
            <li onClick={() => navigate("/manager-notifications")}><span style={{ marginRight: '8px' }} role="img" aria-label="notifications">🔔</span>Manager Notifications</li>
            <li onClick={() => navigate("/manager-chat")}><span style={{ marginRight: '8px' }} role="img" aria-label="chat">💬</span>Chat</li>
            <li onClick={() => navigate("/manager-settings")}><span style={{ marginRight: '8px' }} role="img" aria-label="settings">⚙️</span>Settings</li>
          </ul>
          <div className="sidebar-logo">
            <img src={logo} alt="Logo" style={{ filter: "grayscale(100%)", opacity: 0.65 }} />
            <span className="sidebar-logo-text">Powered by Omblo Technologies</span>
          </div>
        </aside>
        <main className="main-content groupview-main-content">
          <div className="groupview-header">
            <h1>Group Management</h1>
            <button className="btn tx-back-btn" onClick={() => navigate('/manager-dashboard')}>Back to Dashboard</button>
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
              {/* Invite Members Button */}
              <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <button className="btn groupview-invite-btn" onClick={openInviteFlow}>
                  Invite Members to Group
                </button>
              </div>
            </>
          )}
          <div className="groupview-grid">
            {/* Removed old invite card, replaced by new invite flow */}
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
      <Footer />
      {/* Step 1: Select Group Modal */}
      <Modal isOpen={inviteStep === 1} onClose={closeAllModals}>
        <h2>Select Group to Invite Members</h2>
        <select className="groupview-modal-select" value={selectedGroupId} onChange={handleGroupSelect}>
          <option value="">-- Select Group --</option>
          {dummyGroups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <div style={{marginTop: '1.5rem'}}>
          <button className="btn" disabled={!selectedGroupId} onClick={handleGroupConfirm}>Continue</button>
        </div>
      </Modal>
      {/* Step 2: Password Modal */}
      <Modal isOpen={inviteStep === 2} onClose={closeAllModals}>
        <h2>Password Verification</h2>
        <input
          type="password"
          className="modal-input"
          placeholder="Enter your password"
          value={invitePwd}
          onChange={e => setInvitePwd(e.target.value)}
          autoFocus
        />
        {invitePwdError && <div className="modal-error">{invitePwdError}</div>}
        <div style={{marginTop: '1.5rem'}}>
          <button className="btn" onClick={handlePwdConfirm}>Verify</button>
        </div>
      </Modal>
      {/* Step 3: Invite Form Modal */}
      <Modal isOpen={inviteStep === 3} onClose={closeAllModals} width={500}>
        <h2>Invite Members to {selectedGroupName}</h2>
        <div style={{margin: '1rem 0'}}>
          <input
            className="modal-input"
            type="text"
            placeholder="Search users by name or email..."
            value={inviteSearch}
            onChange={handleInviteSearch}
          />
          {inviteResults.length > 0 && (
            <ul className="modal-search-results">
              {inviteResults.map(u => (
                <li key={u.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>{u.name} ({u.email})</span>
                  <button className="btn" style={{fontSize: '0.95rem', padding: '0.2rem 0.7rem'}} onClick={() => handleAddInviteUser(u)}>Add</button>
                </li>
              ))}
            </ul>
          )}
          {inviteSelected.length > 0 && (
            <div className="modal-selected-users" style={{margin: '0.7rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
              {inviteSelected.map(u => (
                <span key={u.id} className="modal-user-tag">
                  {u.name} <button onClick={() => handleRemoveInviteUser(u)} style={{marginLeft: 4, color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700}}>&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>
        <textarea
          className="modal-input"
          style={{width: '100%', minHeight: 70, marginBottom: 12}}
          placeholder="Custom invitation message..."
          value={inviteMsg}
          onChange={e => setInviteMsg(e.target.value)}
        />
        <button className="btn" style={{marginTop: 8}} disabled={inviteSelected.length === 0} onClick={handleSendInvites}>
          Send Invitations
        </button>
      </Modal>
    </div>
  );
};

export default GroupView;
