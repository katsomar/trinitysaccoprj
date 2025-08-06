import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "../styles/SaverDashboard.css";
import Footer from "../components/Footer";
import DepositModal from '../components/DepositModal';
import WithdrawPopup from '../components/WithdrawPopup';

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
              <li onClick={() => setShowDepositModal(true)}>Deposit</li>
              <li onClick={() => setShowWithdrawModal(true)}>Withdraw</li>
              <li onClick={() => navigate("/notifications")}>Notifications</li>
              <li onClick={() => navigate("/chat")}>Chat</li>
              <li onClick={() => navigate("/invites")}>Invites</li>
              <li onClick={() => navigate("/settings")}>Settings</li>
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
