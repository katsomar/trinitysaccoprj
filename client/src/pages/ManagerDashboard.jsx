import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import DepositModal from '../components/DepositModal';
import WithdrawPopup from '../components/WithdrawPopup';
import ManagerTopNav from '../components/ManagerTopNav';
import "../styles/SaverDashboard.css";

// --- Mock Data ---
const GROUPS = [
  {
    id: "education",
    name: "Education Fund",
    balance: 15000,
    interest: 7.5,
    totalMembers: 20,
    activeMembers: 16,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Savings Growth",
          data: [2000, 4000, 6000, 9000, 12000, 14000, 15000],
          backgroundColor: "rgba(0, 123, 255, 0.5)",
          borderColor: "#007bff",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    barData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Deposits",
          data: [500, 1000, 1200, 1500, 2000, 2500, 3000],
          backgroundColor: "rgba(0, 123, 255, 0.7)",
          borderColor: "#007bff",
          borderWidth: 2,
        },
        {
          label: "Withdrawals",
          data: [200, 400, 300, 500, 600, 700, 800],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "#ff6384",
          borderWidth: 2,
        },
      ],
    },
    pieData: {
      labels: ["Deposits", "Withdrawals"],
      datasets: [
        {
          data: [12000, 5000],
          backgroundColor: ["#28a745", "#ffc107"],
          hoverBackgroundColor: ["#218838", "#e0a800"],
          borderWidth: 2,
        },
      ],
    },
    transactions: [
      { id: 1, type: "deposit", member: "Alice", amount: 500, date: "2024-07-10" },
      { id: 2, type: "withdrawal", member: "Bob", amount: 200, date: "2024-07-09" },
      { id: 3, type: "deposit", member: "Carol", amount: 800, date: "2024-07-08" },
    ],
    contributions: [
      { id: 1, member: "Alice", amount: 500, date: "2024-07-10" },
      { id: 2, member: "Carol", amount: 800, date: "2024-07-08" },
    ],
    members: [
      { id: 1, name: "Alice", avatar: "/assets/avatar1.png" },
      { id: 2, name: "Bob", avatar: "/assets/avatar2.png" },
      { id: 3, name: "Carol", avatar: "/assets/avatar3.png" },
      { id: 4, name: "David", avatar: "/assets/avatar4.png" },
    ],
    withdrawalRequests: [
      { id: 1, member: "Bob", amount: 200, date: "2024-07-09", status: "pending" },
    ],
  },
  {
    id: "business",
    name: "Business Group",
    balance: 22000,
    interest: 6.2,
    totalMembers: 15,
    activeMembers: 12,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Savings Growth",
          data: [5000, 8000, 11000, 14000, 17000, 20000, 22000],
          backgroundColor: "rgba(40, 167, 69, 0.5)",
          borderColor: "#28a745",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    barData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Deposits",
          data: [1000, 1200, 1500, 1800, 2000, 2200, 2500],
          backgroundColor: "rgba(0, 123, 255, 0.7)",
          borderColor: "#007bff",
          borderWidth: 2,
        },
        {
          label: "Withdrawals",
          data: [400, 500, 600, 700, 800, 900, 1000],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "#ff6384",
          borderWidth: 2,
        },
      ],
    },
    pieData: {
      labels: ["Deposits", "Withdrawals"],
      datasets: [
        {
          data: [18000, 7000],
          backgroundColor: ["#28a745", "#ffc107"],
          hoverBackgroundColor: ["#218838", "#e0a800"],
          borderWidth: 2,
        },
      ],
    },
    transactions: [
      { id: 1, type: "deposit", member: "Eve", amount: 1000, date: "2024-07-10" },
      { id: 2, type: "withdrawal", member: "Frank", amount: 400, date: "2024-07-09" },
      { id: 3, type: "deposit", member: "Grace", amount: 1200, date: "2024-07-08" },
    ],
    contributions: [
      { id: 1, member: "Eve", amount: 1000, date: "2024-07-10" },
      { id: 2, member: "Grace", amount: 1200, date: "2024-07-08" },
    ],
    members: [
      { id: 5, name: "Eve", avatar: "/assets/avatar5.png" },
      { id: 6, name: "Frank", avatar: "/assets/avatar6.png" },
      { id: 7, name: "Grace", avatar: "/assets/avatar7.png" },
      { id: 8, name: "Heidi", avatar: "/assets/avatar8.png" },
    ],
    withdrawalRequests: [
      { id: 1, member: "Frank", amount: 400, date: "2024-07-09", status: "pending" },
    ],
  },
];

const NOTIFICATIONS = [
  { id: 1, text: "New withdrawal request from Bob.", group: "education" },
  { id: 2, text: "Interest rate updated to 7.5%.", group: "education" },
  { id: 3, text: "Business Group: New member joined.", group: "business" },
];

const CHATS = [
  { id: 1, name: "Education Fund", preview: "Let's meet tomorrow.", unread: true, group: "education" },
  { id: 2, name: "Business Group", preview: "Deposit confirmed.", unread: false, group: "business" },
];

// --- Components ---
function PasswordModal({ isOpen, onClose, onVerify, title, error }) {
  const [password, setPassword] = useState("");
  useEffect(() => { if (!isOpen) setPassword(""); }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
      `}</style>
    </div>
  );
}

function GroupSwitcher({ groups, currentGroupId, onSwitch }) {
  return (
    <div style={{marginBottom: 8, width: '100%', marginTop: '1rem'}}>
      <label htmlFor="group-switcher" style={{fontWeight: 500, marginRight: 8}}>Switch Group:</label>
      <select
        id="group-switcher"
        className="group-select"
        value={currentGroupId}
        onChange={e => onSwitch(e.target.value)}
        style={{minWidth: 180}}
      >
        {groups.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
    </div>
  );
}

function ChartSwitcher({ lineData, barData }) {
  const [chartType, setChartType] = useState("line");
  return (
    <div className="card chart-card">
      <h2>Savings Performance</h2>
      {chartType === "line" ? (
        <Line
          data={lineData}
          options={{
            responsive: true,
            animation: { duration: 1500, easing: "easeInOutQuart" },
            plugins: { legend: { display: true, position: "bottom" } },
          }}
          className="dashboard-chart"
        />
      ) : (
        <Bar
          data={barData}
          options={{
            responsive: true,
            animation: { duration: 1500, easing: "easeInOutQuart" },
            plugins: { legend: { display: true, position: "bottom" } },
          }}
          className="dashboard-chart"
        />
      )}
      <div className="chart-toggle-btns" style={{ marginTop: "1rem", display: "flex", gap: "0.7rem", justifyContent: "center" }}>
        <button className="btn" onClick={() => setChartType("bar")}>Bar</button>
        <button className="btn" onClick={() => setChartType("line")}>Line</button>
      </div>
    </div>
  );
}

function PieChart({ pieData }) {
  return (
    <div className="card chart-card">
      <h2>Deposits vs Withdrawals</h2>
      <Pie
        data={pieData}
        options={{
          responsive: true,
          animation: { animateScale: true, duration: 1200 },
          plugins: { legend: { display: true, position: "bottom" } },
        }}
        className="dashboard-chart"
      />
    </div>
  );
}

function DashboardMetrics({ group }) {
  return (
    <div className="metrics-row" style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: 24}}>
      <div className="metric-card">
        <div className="metric-label">Total Members</div>
        <div className="metric-value" style={{color: '#007bff'}}>{group.totalMembers}</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Active Members</div>
        <div className="metric-value" style={{color: '#28a745'}}>{group.activeMembers}</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Interest Rate</div>
        <div className="metric-value" style={{color: '#ffc107'}}>{group.interest}%</div>
      </div>
    </div>
  );
}

function RecentTransactions({ transactions }) {
  return (
    <div className="card transactions-card" style={{minWidth: 0}}>
      <h2>Recent Transactions</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            <span className={`trans-type ${t.type}`}>{t.type}</span>
            <span className="trans-amount">${t.amount}</span>
            <span className="trans-date">{t.date}</span>
            <span className="trans-member">{t.member}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LatestContributions({ contributions }) {
  return (
    <div className="card" style={{minWidth: 0}}>
      <h2>Latest Contributions</h2>
      <ul>
        {contributions.map(c => (
          <li key={c.id}><strong>{c.member}</strong>: ${c.amount} on {c.date}</li>
        ))}
      </ul>
    </div>
  );
}

function MemberShowcase({ members }) {
  return (
    <div className="card" style={{minWidth: 0}}>
      <h2>Member Showcase</h2>
      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
        {members.map(m => (
          <li key={m.id} style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
            <img src={m.avatar} alt={m.name} className="avatar" style={{width: 32, height: 32}} />
            <span>{m.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WithdrawalRequests({ requests }) {
  return (
    <div className="card" style={{minWidth: 0}}>
      <h2>Withdrawal Requests</h2>
      <ul>
        {requests.map(w => (
          <li key={w.id}>
            <strong>{w.member}</strong>: ${w.amount} on {w.date} <span style={{ color: "#ffc107" }}>{w.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Main Dashboard ---
export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [currentGroupId, setCurrentGroupId] = useState(GROUPS[0].id);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdModalTitle, setPwdModalTitle] = useState("");
  const [pwdModalError, setPwdModalError] = useState("");
  const [pwdModalCallback, setPwdModalCallback] = useState(() => () => {});
  const [pendingGroupId, setPendingGroupId] = useState(null);
  const [messageToView, setMessageToView] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Mobile search state
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
  const handleMobileSearch = (e) => {
    const val = e.target.value;
    setMobileSearch(val);
    if (val.trim() === '') { setMobileResults([]); return; }
    if (mobileSearchType === 'group') {
      setMobileResults(mobileGroups.filter(g => g.name.toLowerCase().includes(val.toLowerCase())));
    } else {
      setMobileResults(mobileUsers.filter(u => u.name.toLowerCase().includes(val.toLowerCase()) || u.username.toLowerCase().includes(val.toLowerCase())));
    }
  };
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

  const currentGroup = GROUPS.find(g => g.id === currentGroupId);

  // Handle group switch
  function handleGroupSwitch(newGroupId) {
    if (newGroupId === currentGroupId) return;
    setPendingGroupId(newGroupId);
    setPwdModalTitle("Verify Password to Switch Group");
    setPwdModalCallback(() => (pwd) => {
      if (pwd) {
        setCurrentGroupId(newGroupId);
        setShowPwdModal(false);
        setPendingGroupId(null);
        setPwdModalError("");
      } else {
        setPwdModalError("Password required");
      }
    });
    setShowPwdModal(true);
  }

  // Handle chat/notification click
  function handleProtectedView(item, type) {
    if (item.group && item.group !== currentGroupId) {
      setMessageToView({ ...item, type });
      setPwdModalTitle("Re-enter Password to View " + (type === "chat" ? "Chat" : "Notification"));
      setPwdModalCallback(() => (pwd) => {
        if (pwd) {
          setShowPwdModal(false);
          setPwdModalError("");
          alert(type === "chat" ? item.name + ": " + item.preview : item.text);
          setMessageToView(null);
        } else {
          setPwdModalError("Password required");
        }
      });
      setShowPwdModal(true);
    } else {
      alert(type === "chat" ? item.name + ": " + item.preview : item.text);
    }
  }

  return (
    <div className="scrollable-page">
      <div className="saver-dashboard">
        {/* Navbar */}
        <ManagerTopNav />
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
            <span className={`status-dot online`}></span>
            <span>Online</span>
          </div>
          
          {/* Search with type selector + dropdown */}
          <div className="mobile-menu-section mobile-search">
            <label className="mobile-label" htmlFor="mobile-search-input-mgr">Search</label>
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
                id="mobile-search-input-mgr"
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
                        <button className="discover-chat-btn" onClick={() => { closeMobileMenu(); navigate('/manager-chat'); }}>Chat</button>
                        <button className="discover-join-btn" onClick={() => alert('Invite flow (mock)')}>Invite</button>
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
            <li onClick={() => { closeMobileMenu(); navigate('/members'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="members">👥</span>Members</li>
            <li onClick={() => { closeMobileMenu(); navigate('/manager-transactions'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="transactions">💳</span>Transactions</li>
            <li onClick={() => { closeMobileMenu(); navigate('/groups'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="groups">🗂️</span>Groups</li>
            <li onClick={() => { closeMobileMenu(); navigate('/interest-calculator'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="calculator">🧮</span>Interest Calculator</li>
            <li onClick={() => { closeMobileMenu(); navigate('/reports'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="reports">📊</span>Reports</li>
            <li onClick={() => { closeMobileMenu(); navigate('/manager-notifications'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="notifications">🔔</span>Manager Notifications</li>
            <li onClick={() => { closeMobileMenu(); navigate('/manager-chat'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="chat">💬</span>Chat</li>
            <li onClick={() => { closeMobileMenu(); navigate('/manager-settings'); }}><span style={{ marginRight: '8px' }} role="img" aria-label="settings">⚙️</span>Settings</li>
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
              <span className="status-dot online"></span>
              <span>Online</span>
            </div>
            <ul className="sidebar-menu">
              <li onClick={() => navigate("/members")}><span style={{ marginRight: '8px' }} role="img" aria-label="members">👥</span>Members</li>
              <li onClick={() => navigate("/manager-transactions")}><span style={{ marginRight: '8px' }} role="img" aria-label="transactions">💳</span>Transactions</li>
              <li onClick={() => navigate("/groups")}><span style={{ marginRight: '8px' }} role="img" aria-label="groups">🗂️</span>Groups</li>
              <li onClick={() => navigate("/interest-calculator")}><span style={{ marginRight: '8px' }} role="img" aria-label="calculator">🧮</span>Interest Calculator</li>
              <li onClick={() => navigate("/reports")}><span style={{ marginRight: '8px' }} role="img" aria-label="reports">📊</span>Reports</li>
              <li onClick={() => navigate("/manager-notifications")}><span style={{ marginRight: '8px' }} role="img" aria-label="notifications">🔔</span>Manager Notifications</li>
              <li onClick={() => navigate("/manager-chat")}><span style={{ marginRight: '8px' }} role="img" aria-label="chat">💬</span>Chat</li>
              <li onClick={() => navigate("/manager-settings")}><span style={{ marginRight: '8px' }} role="img" aria-label="settings">⚙️</span>Settings</li>
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
              <h1>Welcome, Manager Jane</h1>
              <p>Account Number: <span className="account-number">SACCO20250717002</span></p>
            </section>

            {/* Cards Grid */}
            <section className="cards-grid">
              {/* Balance Card with Group Switcher and Deposit/Withdraw buttons */}
              <article className="card balance-card">
                <h2>Group Account Balance</h2>
                <p className="balance-amount">${currentGroup.balance.toLocaleString()}</p>
                <div className="balance-buttons" style={{display: 'flex', gap: '0.7rem', marginTop: '0.5rem', justifyContent: 'center'}}>
                  <button className="btn deposit-btn" onClick={() => setShowDepositModal(true)}>Deposit</button>
                  <button className="btn withdraw-btn" onClick={() => setShowWithdrawModal(true)}>Withdraw</button>
                </div>
                <GroupSwitcher groups={GROUPS} currentGroupId={currentGroupId} onSwitch={handleGroupSwitch} />
              </article>

              {/* ChartSwitcher: Line/Bar toggle in one card */}
              <ChartSwitcher lineData={currentGroup.chart} barData={currentGroup.barData} />

              {/* Chart: Pie */}
              <PieChart pieData={currentGroup.pieData} />

              {/* Metrics */}
              <article className="card" style={{minWidth: 0}}>
                <DashboardMetrics group={currentGroup} />
              </article>

              {/* Member Showcase as a list */}
              <MemberShowcase members={currentGroup.members} />

              {/* Latest Contributions */}
              <LatestContributions contributions={currentGroup.contributions} />

              {/* Recent Transactions */}
              <RecentTransactions transactions={currentGroup.transactions} />

              {/* Withdrawal Requests */}
              <WithdrawalRequests requests={currentGroup.withdrawalRequests} />

              {/* Notifications (global) */}
              <article className="card notifications-card">
                <h2>Notifications</h2>
                <ul>
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id} style={{cursor: n.group !== currentGroupId ? 'pointer' : 'default', fontWeight: n.group !== currentGroupId ? 600 : 400, color: n.group !== currentGroupId ? '#007bff' : undefined}}
                      onClick={() => handleProtectedView(n, "notification")}
                    >
                      {n.text} {n.group !== currentGroupId && <span style={{fontSize:12, color:'#888'}}>(Group)</span>}
                    </li>
                  ))}
                </ul>
                <button className="btn">View More</button>
              </article>

              {/* Chats (global) */}
              <article className="card chat-card">
                <h2>
                  Chats <span className="chat-badge">{CHATS.filter((c) => c.unread).length}</span>
                </h2>
                <ul>
                  {CHATS.map((c) => (
                    <li key={c.id} style={{cursor: c.group !== currentGroupId ? 'pointer' : 'default', fontWeight: c.group !== currentGroupId ? 600 : 400, color: c.group !== currentGroupId ? '#007bff' : undefined}}
                      onClick={() => handleProtectedView(c, "chat")}
                    >
                      <strong>{c.name}:</strong> {c.preview} {c.group !== currentGroupId && <span style={{fontSize:12, color:'#888'}}>(Group)</span>}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "0.7rem" }}>
                  <button className="btn">Send Message</button>
                  <button className="btn">View Messages</button>
                </div>
              </article>
            </section>
          </main>
        </div>

        {/* Footer */}
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

          /* Mobile profile + search extended */
          .mobile-profile { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
          .mobile-profile-name { font-weight: 600; color: #0f172a; }
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
            .cards-grid { gap: 1rem; }
          }
        `}</style>
      </div>
      {/* Password Modal for group switch or protected content */}
      <PasswordModal
        isOpen={showPwdModal}
        onClose={() => { setShowPwdModal(false); setPwdModalError(""); setPendingGroupId(null); setMessageToView(null); }}
        onVerify={pwd => pwdModalCallback(pwd)}
        title={pwdModalTitle}
        error={pwdModalError}
      />
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
      <WithdrawPopup isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
    </div>
  );
}
