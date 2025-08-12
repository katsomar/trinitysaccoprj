import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "../styles/SaverDashboard.css";
import Footer from "../components/Footer";
import DepositModal from '../components/DepositModal';
import WithdrawPopup from '../components/WithdrawPopup';
import SaverTopNav from "../components/SaverTopNav";

// Dummy group data
const groups = [
  {
    id: "personal",
    name: "Personal Savings",
    balance: 1200.5,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Deposits",
          data: [100, 200, 150, 300, 250, 400, 350],
          backgroundColor: "rgba(0, 123, 255, 0.7)",
          borderColor: "#007bff",
          borderWidth: 2,
        },
        {
          label: "Withdrawals",
          data: [50, 80, 60, 120, 90, 130, 100],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "#ff6384",
          borderWidth: 2,
        },
      ],
    },
    pie: {
      labels: ["Deposits", "Withdrawals"],
      datasets: [
        {
          data: [750, 630],
          backgroundColor: ["#28a745", "#ffc107"],
          hoverBackgroundColor: ["#218838", "#e0a800"],
          borderWidth: 2,
        },
      ],
    },
    transactions: [
      { id: 1, type: "deposit", amount: 200, date: "2024-06-01" },
      { id: 2, type: "withdrawal", amount: 50, date: "2024-05-28" },
      { id: 3, type: "deposit", amount: 100, date: "2024-05-20" },
    ],
  },
  {
    id: "group1",
    name: "School Savers",
    balance: 3200.75,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Deposits",
          data: [300, 400, 350, 500, 450, 600, 550],
          backgroundColor: "rgba(0, 123, 255, 0.7)",
          borderColor: "#007bff",
          borderWidth: 2,
        },
        {
          label: "Withdrawals",
          data: [100, 180, 160, 220, 190, 230, 200],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "#ff6384",
          borderWidth: 2,
        },
      ],
    },
    pie: {
      labels: ["Deposits", "Withdrawals"],
      datasets: [
        {
          data: [3350, 1280],
          backgroundColor: ["#28a745", "#ffc107"],
          hoverBackgroundColor: ["#218838", "#e0a800"],
          borderWidth: 2,
        },
      ],
    },
    transactions: [
      { id: 1, type: "deposit", amount: 500, date: "2024-06-02" },
      { id: 2, type: "withdrawal", amount: 200, date: "2024-05-30" },
      { id: 3, type: "deposit", amount: 300, date: "2024-05-25" },
    ],
  },
  {
    id: "group2",
    name: "Family Fund",
    balance: 2100.0,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Deposits",
          data: [200, 250, 220, 300, 270, 350, 320],
          backgroundColor: "rgba(0, 123, 255, 0.7)",
          borderColor: "#007bff",
          borderWidth: 2,
        },
        {
          label: "Withdrawals",
          data: [80, 100, 90, 120, 110, 130, 120],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "#ff6384",
          borderWidth: 2,
        },
      ],
    },
    pie: {
      labels: ["Deposits", "Withdrawals"],
      datasets: [
        {
          data: [1910, 750],
          backgroundColor: ["#28a745", "#ffc107"],
          hoverBackgroundColor: ["#218838", "#e0a800"],
          borderWidth: 2,
        },
      ],
    },
    transactions: [
      { id: 1, type: "deposit", amount: 350, date: "2024-06-03" },
      { id: 2, type: "withdrawal", amount: 120, date: "2024-05-29" },
      { id: 3, type: "deposit", amount: 220, date: "2024-05-22" },
    ],
  },
  {
    id: "group3",
    name: "Holiday Club",
    balance: 800.25,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Deposits",
          data: [50, 100, 80, 120, 90, 150, 130],
          backgroundColor: "rgba(0, 123, 255, 0.7)",
          borderColor: "#007bff",
          borderWidth: 2,
        },
        {
          label: "Withdrawals",
          data: [20, 40, 30, 60, 50, 70, 60],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "#ff6384",
          borderWidth: 2,
        },
      ],
    },
    pie: {
      labels: ["Deposits", "Withdrawals"],
      datasets: [
        {
          data: [720, 330],
          backgroundColor: ["#28a745", "#ffc107"],
          hoverBackgroundColor: ["#218838", "#e0a800"],
          borderWidth: 2,
        },
      ],
    },
    transactions: [
      { id: 1, type: "deposit", amount: 150, date: "2024-06-04" },
      { id: 2, type: "withdrawal", amount: 60, date: "2024-05-27" },
      { id: 3, type: "deposit", amount: 80, date: "2024-05-21" },
    ],
  },
];

// Dummy notifications and chats with group tags
const notifications = [
  { id: 1, text: "Deposit of $100 received.", group: "personal" },
  { id: 2, text: "Withdrawal request approved.", group: "personal" },
  { id: 3, text: "New group invitation: School Savers.", group: "group1" },
  { id: 4, text: "Family Fund: Meeting scheduled.", group: "group2" },
];

const chats = [
  { id: 1, name: "Manager Jane", preview: "Your withdrawal is approved.", unread: true, group: "personal" },
  { id: 2, name: "Group: School Savers", preview: "Meeting at 5pm.", unread: false, group: "group1" },
  { id: 3, name: "Friend: Alex", preview: "Can you join my group?", unread: true, group: "personal" },
  { id: 4, name: "Family Fund", preview: "Contribution due.", unread: true, group: "group2" },
];

const cautions = [
  { id: 1, text: "Account balance below threshold!", type: "danger" },
  { id: 2, text: "Account unchanged for 3 months – please recharge.", type: "warning" },
];

// Modal component
function PasswordModal({ isOpen, onClose, onVerify, title, error }) {
  const [password, setPassword] = useState("");
  React.useEffect(() => {
    if (!isOpen) setPassword("");
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" style={{animation: 'fadeIn 0.2s'}}>
      <div className="modal-content" style={{animation: 'slideDown 0.3s'}}>
        <h2 style={{marginBottom: 12}}>{title || "Enter Password"}</h2>
        <input
          type="password"
          className="modal-input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-actions">
          <button className="btn" onClick={() => { if(password) onVerify(password); }} style={{marginRight: 8}}>Verify</button>
          <button className="btn withdraw-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.25); z-index: 2000; display: flex; align-items: center; justify-content: center;
        }
        .modal-content {
          background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 2rem 2.5rem; min-width: 320px; max-width: 90vw; text-align: center; position: relative;
        }
        .modal-input {
          width: 80%; padding: 0.7rem; border-radius: 8px; border: 1px solid #e3e6ee; font-size: 1.1rem; margin-bottom: 1rem;
        }
        .modal-actions { display: flex; justify-content: center; gap: 1rem; }
        .modal-error { color: #dc3545; margin-bottom: 0.5rem; font-size: 1rem; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

const SaverDashboard = () => {
  const [user] = useState({
    name: localStorage.getItem("userName") || "John Doe",
    accountNumber: "1234567890",
    avatar: "/assets/avatar.png",
    online: true,
  });
  const [activeGroup, setActiveGroup] = useState(groups[0].id); // default to personal
  const [pendingGroup, setPendingGroup] = useState(null); // for modal switching
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdModalTitle, setPwdModalTitle] = useState("");
  const [pwdModalCallback, setPwdModalCallback] = useState(() => () => {});
  const [pwdModalError, setPwdModalError] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [messageToView, setMessageToView] = useState(null); // for chat/notification modal
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(v => !v);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') closeMobileMenu(); };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  // Mobile search state (mirrors desktop search)
  const [mobileSearchType, setMobileSearchType] = useState('group');
  const [mobileSearch, setMobileSearch] = useState('');
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileShowTrending, setMobileShowTrending] = useState(false);
  const mobileGroups = [
    { id: 'g1', name: 'Education Fund', members: 24 },
    { id: 'g2', name: 'Business Group', members: 15 },
    { id: 'g3', name: 'Holiday Club', members: 8 },
    { id: 'g4', name: 'Women Empowerment', members: 32 },
    { id: 'g5', name: 'Farmers SACCO', members: 19 },
  ];
  const mobileUsers = [
    { id: 'u1', username: 'jane_doe', name: 'Jane Doe' },
    { id: 'u2', username: 'john_smith', name: 'John Smith' },
    { id: 'u3', username: 'alice_j', name: 'Alice Johnson' },
    { id: 'u4', username: 'bob_lee', name: 'Bob Lee' },
    { id: 'u5', username: 'mary_ann', name: 'Mary Ann' },
  ];
  function handleMobileSearch(e) {
    const val = e.target.value;
    setMobileSearch(val);
    if (val.trim() === '') { setMobileResults([]); return; }
    if (mobileSearchType === 'group') {
      setMobileResults(mobileGroups.filter(g => g.name.toLowerCase().includes(val.toLowerCase())));
    } else {
      setMobileResults(mobileUsers.filter(u => u.name.toLowerCase().includes(val.toLowerCase()) || u.username.toLowerCase().includes(val.toLowerCase())));
    }
  }

  // Find current group object
  const currentGroup = groups.find(g => g.id === activeGroup) || groups[0];

  // Handle group switch
  function handleGroupChange(e) {
    const newGroupId = e.target.value;
    if (newGroupId === activeGroup) return;
    setPendingGroup(newGroupId);
    setPwdModalTitle("Verify Password to Switch Group");
    setPwdModalCallback(() => (pwd) => {
      if (pwd) {
        setActiveGroup(newGroupId);
        setShowPwdModal(false);
        setPendingGroup(null);
        setPwdModalError("");
      } else {
        setPwdModalError("Password required");
      }
    });
    setShowPwdModal(true);
  }

  // Handle chat/notification click
  function handleProtectedView(item, type) {
    if (item.group && item.group !== activeGroup) {
      setMessageToView({ ...item, type });
      setPwdModalTitle("Re-enter Password to View " + (type === "chat" ? "Chat" : "Notification"));
      setPwdModalCallback(() => (pwd) => {
        if (pwd) {
          setShowPwdModal(false);
          setPwdModalError("");
          // Show content modal (simulate)
          alert((type === "chat" ? item.name + ": " + item.preview : item.text));
          setMessageToView(null);
        } else {
          setPwdModalError("Password required");
        }
      });
      setShowPwdModal(true);
    } else {
      // Show content directly
      alert(type === "chat" ? item.name + ": " + item.preview : item.text);
    }
  }

  return (
    <div className="scrollable-page">
      <div className="saver-dashboard">
        {/* Navbar */}
        <SaverTopNav />
        {/* Hamburger Toggle (visible on <= 1024px) */}
        <button
          className={`hamburger-toggle ${mobileMenuOpen ? 'active' : ''}`}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-side-menu"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Backdrop below navbar when menu open */}
        {mobileMenuOpen && <div className="mobile-menu-backdrop" onClick={closeMobileMenu} aria-hidden="true"></div>}

        {/* Mobile Side Menu (below navbar) */}
        <nav id="mobile-side-menu" className={`mobile-side-menu ${mobileMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="false" aria-label="Mobile Navigation">
          {/* Online/Offline */}
          <div className="mobile-menu-section online-status">
            <span className={`status-dot ${user.online ? 'online' : 'offline'}`}></span>
            <span>{user.online ? 'Online' : 'Offline'}</span>
          </div>
          
          {/* Search + Type selector (mirrors desktop discover search) */}
          <div className="mobile-menu-section mobile-search">
            <label className="mobile-label" htmlFor="mobile-search-input">Search</label>
            <div className="mobile-searchbar-wrapper">
              <div className="mobile-type-select-wrapper">
                <select
                  className="mobile-type-select"
                  value={mobileSearchType}
                  onChange={e => { setMobileSearchType(e.target.value); setMobileSearch(''); setMobileResults([]); }}
                >
                  <option value="group">🗂️ Groups</option>
                  <option value="user">👥 Users</option>
                </select>
              </div>
              <span className="mobile-search-icon" aria-hidden="true">🔍</span>
              <input
                id="mobile-search-input"
                type="text"
                placeholder={`Search ${mobileSearchType === 'group' ? 'groups' : 'users'}...`}
                aria-label="Search"
                value={mobileSearch}
                onChange={handleMobileSearch}
                onFocus={() => { setMobileShowTrending(true); }}
                onBlur={() => { setTimeout(() => setMobileShowTrending(false), 180); }}
              />
            </div>
            {(mobileSearch.length > 0) && (
              <div className="mobile-search-dropdown">
                {mobileSearchType === 'group' ? (
                  mobileResults.length > 0 ? mobileResults.map(g => (
                    <div className="mobile-search-row" key={g.id}>
                      <span className="mobile-result-name">{g.name}</span>
                      <span className="mobile-result-meta">{g.members ?? '—'} members</span>
                      <button className="discover-join-btn" onClick={() => alert('Request to join sent')}>Request</button>
                    </div>
                  )) : <div className="mobile-search-empty">No groups found.</div>
                ) : (
                  mobileResults.length > 0 ? mobileResults.map(u => (
                    <div className="mobile-search-row" key={u.id}>
                      <span className="mobile-result-name">{u.name} <span className="mobile-result-meta">@{u.username}</span></span>
                      <div className="mobile-result-actions">
                        <button className="discover-chat-btn" onClick={() => { closeMobileMenu(); navigate('/chat'); }}>Chat</button>
                      </div>
                    </div>
                  )) : <div className="mobile-search-empty">No users found.</div>
                )}
              </div>
            )}
            {mobileShowTrending && mobileSearchType === 'group' && mobileSearch.trim() === '' && (
              <div className="mobile-search-dropdown">
                <div className="mobile-search-title">Trending Groups</div>
                {mobileGroups.map(g => (
                  <div className="mobile-search-row" key={g.id}>
                    <span className="mobile-result-name">{g.name}</span>
                    <span className="mobile-result-meta">{g.members} members</span>
                    <button className="discover-join-btn" onClick={() => alert('Request to join sent')}>Request</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <ul className="mobile-nav-links">
            <li onClick={() => { closeMobileMenu(); setShowDepositModal(true); }}><span style={{ marginRight: '8px' }} role="img" aria-label="deposit">💰</span>Deposit</li>
            <li onClick={() => { closeMobileMenu(); setShowWithdrawModal(true); }}><span style={{ marginRight: '8px' }} role="img" aria-label="withdraw">💸</span>Withdraw</li>
            <li onClick={() => { closeMobileMenu(); navigate('/notifications'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="notifications">🔔</span>Notifications</li>
            <li onClick={() => { closeMobileMenu(); navigate('/chat'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="chat">💬</span>Chat</li>
            <li onClick={() => { closeMobileMenu(); navigate('/invites'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="invites">📩</span>Invites/Requests</li>
            <li onClick={() => { closeMobileMenu(); navigate('/settings'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="settings">⚙️</span>Settings</li>
            <li onClick={() => { closeMobileMenu(); window.location.href = '/login'; }}><span style={{ marginRight: '8px' }} role="img" aria-label="logout">🚪</span>Logout</li>
          </ul>

          {/* Footer logo */}
          <div className="mobile-menu-footer">
            <img src="/src/assets/images/logo.png" alt="Trinity SACCO" />
            <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
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
              <li onClick={() => setShowDepositModal(true)}><span style={{ marginRight: '8px' }} role="img" aria-label="deposit">💰</span>Deposit</li>
              <li onClick={() => setShowWithdrawModal(true)}><span style={{ marginRight: '8px' }} role="img" aria-label="withdraw">💸</span>Withdraw</li>
              <li onClick={() => navigate("/notifications")}><span style={{ marginRight: '8px' }} role="img" aria-label="notifications">🔔</span>Notifications</li>
              <li onClick={() => navigate("/chat")}><span style={{ marginRight: '8px' }} role="img" aria-label="chat">💬</span>Chat</li>
              <li onClick={() => navigate("/invites")}><span style={{ marginRight: '8px' }} role="img" aria-label="invites">📩</span>Invites/Requests</li>
              <li onClick={() => navigate("/settings")}><span style={{ marginRight: '8px' }} role="img" aria-label="settings">⚙️</span>Settings</li>
            </ul>
            <div className="sidebar-logo">
              <img src="/src/assets/images/logo.png" alt="Trinity SACCO" style={{ filter: "grayscale(100%)", opacity: 0.65 }} />
              <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            {/* Greeting */}
            <section className="greeting-section">
              <h1>Welcome, {user.name}</h1>
              <p>Account Number: <span className="account-number">{user.accountNumber}</span></p>
            </section>

            {/* Cards Grid */}
            <section className="cards-grid">
              {/* Account Balance Card */}
              <article className="card balance-card">
                <h2>Account Balance</h2>
                <p className="balance-amount">${currentGroup.balance.toFixed(2)}</p>
                <div className="balance-actions">
                  <select
                    value={activeGroup}
                    onChange={handleGroupChange}
                    className="group-select"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  <div className="balance-buttons">
                    <button className="btn deposit-btn" onClick={() => setShowDepositModal(true)}>
                      Deposit
                    </button>
                    <button className="btn withdraw-btn" onClick={() => setShowWithdrawModal(true)}>
                      Withdraw
                    </button>
                  </div>
                </div>
              </article>

              {/* Charts Section */}
              <article className="card chart-card">
                <h2>Performance</h2>
                <Bar
                  data={currentGroup.chart}
                  options={{
                    responsive: true,
                    animation: { duration: 1500, easing: "easeInOutQuart" },
                    plugins: { legend: { display: true, position: "bottom" } },
                  }}
                  className="dashboard-chart"
                />
              </article>
              <article className="card chart-card">
                <h2>Deposits vs Withdrawals</h2>
                <Pie
                  data={currentGroup.pie}
                  options={{
                    responsive: true,
                    animation: { animateScale: true, duration: 1200 },
                    plugins: { legend: { display: true, position: "bottom" } },
                  }}
                  className="dashboard-chart"
                />
              </article>

              {/* Notifications Card */}
              <article className="card notifications-card">
                <h2>Notifications</h2>
                <ul>
                  {notifications.slice(0, 4).map((n) => (
                    <li key={n.id} style={{cursor: n.group !== activeGroup ? 'pointer' : 'default', fontWeight: n.group !== activeGroup ? 600 : 400, color: n.group !== activeGroup ? '#007bff' : undefined}}
                      onClick={() => handleProtectedView(n, "notification")}
                    >
                      {n.text} {n.group !== activeGroup && <span style={{fontSize:12, color:'#888'}}>(Group)</span>}
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/notifications")}>View Notifications</button>
              </article>

              {/* Chat Card */}
              <article className="card chat-card">
                <h2>
                  Chats <span className="chat-badge">{chats.filter((c) => c.unread).length}</span>
                </h2>
                <ul>
                  {chats.slice(0, 4).map((c) => (
                    <li key={c.id} style={{cursor: c.group !== activeGroup ? 'pointer' : 'default', fontWeight: c.group !== activeGroup ? 600 : 400, color: c.group !== activeGroup ? '#007bff' : undefined}}
                      onClick={() => handleProtectedView(c, "chat")}
                    >
                      <strong>{c.name}:</strong> {c.preview} {c.group !== activeGroup && <span style={{fontSize:12, color:'#888'}}>(Group)</span>}
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/chat")}>View More</button>
              </article>

              {/* Account Cautions Card */}
              <article className="card cautions-card">
                <h2>Account Cautions</h2>
                <ul>
                  {cautions.map((c) => (
                    <li key={c.id} className={`caution-${c.type}`}>{c.text}</li>
                  ))}
                </ul>
              </article>

              {/* Transactions Summary Card */}
              <article className="card transactions-card">
                <h2>Recent Transactions</h2>
                <ul>
                  {currentGroup.transactions.slice(0, 3).map((t) => (
                    <li key={t.id}>
                      <span className={`trans-type ${t.type}`}>{t.type}</span>
                      <span className="trans-amount">${t.amount}</span>
                      <span className="trans-date">{t.date}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/transactions")}>View More</button>
              </article>
            </section>
          </main>
        </div>

        {/* Footer - only at the bottom */}
        <footer className="footer">
          <span>&copy; 2024 Trinity SACCO. All rights reserved.</span>
        </footer>
        {/* Responsive Mobile Menu Styles */}
        <style>{`
          :root { --nav-h: 56px; }

          /* Hamburger toggle */
          .hamburger-toggle {
            position: fixed;
            top: 10px;
            right: 14px;
            width: 42px;
            height: 42px;
            border-radius: 10px;
            border: none;
            background: rgba(255,255,255,0.12);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1001; /* above navbar (1000) */
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .hamburger-toggle:hover { background: rgba(255,255,255,0.2); }
          .hamburger-toggle span {
            position: absolute;
            width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: transform 0.28s ease, opacity 0.2s ease, top 0.28s ease; left: 10px;
          }
          .hamburger-toggle span:nth-child(1) { top: 14px; }
          .hamburger-toggle span:nth-child(2) { top: 20px; }
          .hamburger-toggle span:nth-child(3) { top: 26px; }
          .hamburger-toggle.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
          .hamburger-toggle.active span:nth-child(2) { opacity: 0; }
          .hamburger-toggle.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

          /* Mobile side menu */
          .mobile-side-menu {
            position: fixed;
            top: var(--nav-h);
            left: 0;
            width: min(84vw, 340px);
            height: calc(100vh - var(--nav-h));
            background: rgba(255,255,255,0.72);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            border-right: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            transform: translateX(-102%);
            transition: transform 0.32s ease;
            z-index: 1000; /* below hamburger */
            padding: 1rem 1rem 1.2rem 1rem;
            overflow-y: auto;
          }
          .mobile-side-menu.open { transform: translateX(0); }
          .mobile-menu-section { margin-bottom: 1rem; }
          .mobile-search-input { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.9); border: 1px solid #e3e6ee; border-radius: 10px; padding: 0.5rem 0.75rem; }
          .mobile-search-input input { border: none; outline: none; width: 100%; font-size: 1rem; background: transparent; color: #0f172a; }
          .mobile-label { display: block; font-weight: 600; color: #004080; margin-bottom: 6px; }
          .mobile-group-select { width: 100%; }
          .mobile-nav-links { list-style: none; padding: 0; margin: 0.5rem 0 1rem 0; }
          .mobile-nav-links li { padding: 0.7rem 0.8rem; margin-bottom: 0.5rem; border-radius: 10px; background: rgba(255,255,255,0.9); border: 1px solid #e3e6ee; color: #004080; font-weight: 600; cursor: pointer; transition: background 0.2s ease; }
          .mobile-nav-links li:hover { background: #eef4ff; }
          .mobile-menu-footer { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 1.2rem; color: #888; }
          .mobile-menu-footer img { max-width: 100px; opacity: 0.7; }

          /* Mobile profile */
          .mobile-profile { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
          .mobile-profile-name { font-weight: 600; color: #0f172a; }

          /* Mobile search enhanced */
          .mobile-searchbar-wrapper { position: relative; display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.95); border: 1px solid #e3e6ee; border-radius: 10px; padding: 0.45rem 0.6rem; }
          .mobile-searchbar-wrapper input { border: none; outline: none; width: 100%; background: transparent; font-size: 1rem; color: #0f172a; }
          .mobile-type-select-wrapper { border-right: 1px solid #e3e6ee; padding-right: 6px; margin-right: 6px; }
          .mobile-type-select { border: none; background: transparent; font-weight: 600; color: #004080; }
          .mobile-search-dropdown { margin-top: 8px; background: rgba(255,255,255,0.98); border: 1px solid #e3e6ee; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
          .mobile-search-title { font-weight: 700; color: #004080; padding: 10px 12px; border-bottom: 1px solid #eef2f7; }
          .mobile-search-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
          .mobile-search-row:last-child { border-bottom: none; }
          .mobile-result-name { font-weight: 600; color: #0f172a; }
          .mobile-result-meta { color: #64748b; font-size: 0.92rem; margin-left: 8px; }
          .mobile-search-empty { padding: 12px; color: #64748b; }
          .discover-join-btn, .discover-chat-btn { border: none; border-radius: 8px; background: #007bff; color: #fff; padding: 6px 10px; cursor: pointer; }

          /* Backdrop under navbar */
          .mobile-menu-backdrop {
            position: fixed;
            top: var(--nav-h);
            left: 0;
            width: 100vw;
            height: calc(100vh - var(--nav-h));
            background: rgba(0,0,0,0.2);
            z-index: 999; /* below menu */
          }

          /* Responsive: hide desktop sidebar, adjust layout, show hamburger, hide navbar search */
          @media (max-width: 1024px) {
            .sidebar { display: none; }
            .dashboard-body { margin-left: 0; }
            .main-content { margin-left: 0; padding: 1rem; }
            .navbar .navbar-center { display: none; }
            .navbar .logout-btn { display: none !important; }
            .hamburger-toggle { display: inline-flex; }
          }

          /* Fine-tune spacing on small devices */
          @media (max-width: 600px) {
            .greeting-section h1 { font-size: 1.6rem; }
            .card h2 { font-size: 1.1rem; }
            .balance-amount { font-size: 2.2rem; }
            .cards-grid { gap: 1rem; }
          }
        `}</style>
      </div>
      {/* Password Modal for group switch or protected content */}
      <PasswordModal
        isOpen={showPwdModal}
        onClose={() => { setShowPwdModal(false); setPwdModalError(""); setPendingGroup(null); setMessageToView(null); }}
        onVerify={pwd => pwdModalCallback(pwd)}
        title={pwdModalTitle}
        error={pwdModalError}
      />
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
      <WithdrawPopup isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
    </div>
  );
};

export default SaverDashboard;
