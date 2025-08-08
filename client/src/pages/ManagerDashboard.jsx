import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import DepositModal from '../components/DepositModal';
import WithdrawPopup from '../components/WithdrawPopup';
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
        <nav className="navbar">
          <div className="navbar-left">
            <div className="profile-viewer" style={{ cursor: 'pointer' }}>
              <img src="/assets/manager-avatar.png" alt="Avatar" className="avatar" />
              <span>Manager Jane</span>
            </div>
          </div>
          <div className="navbar-center">
            <input type="text" className="search-bar" placeholder="Search groups or friends..." />
            <button className="discover-btn" onClick={() => navigate("/manager-discover")}>Discover</button>
          </div>
          <div className="navbar-right">
            <button className="logout-btn">Logout</button>
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
              <li onClick={() => navigate("/members")}>Members</li>
              <li onClick={() => navigate("/transactions")}>Transactions</li>
              <li onClick={() => navigate("/groups")}>Groups</li>
              <li onClick={() => navigate("/interest-calculator")}>Interest Calculator</li>
              <li onClick={() => navigate("/reports")}>Reports</li>
              <li onClick={() => navigate("/manager-notifications")}>Manager Notifications</li>
              <li onClick={() => navigate("/manager-chat")}>Chat</li>
              <li onClick={() => navigate("/manager-settings")}>Settings</li>
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
