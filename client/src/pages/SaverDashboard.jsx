import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Chart, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import "../styles/SaverDashboard.css"; // Ensure your theme CSS is imported
import Footer from "../components/Footer";
import DepositModal from '../components/DepositModal';

const notifications = [
  { id: 1, text: "Deposit of $100 received." },
  { id: 2, text: "Withdrawal request approved." },
  { id: 3, text: "New group invitation: School Savers." },
];

const chats = [
  { id: 1, name: "Manager Jane", preview: "Your withdrawal is approved.", unread: true },
  { id: 2, name: "Group: School Savers", preview: "Meeting at 5pm.", unread: false },
  { id: 3, name: "Friend: Alex", preview: "Can you join my group?", unread: true },
];

const cautions = [
  { id: 1, text: "Account balance below threshold!", type: "danger" },
  { id: 2, text: "Account unchanged for 3 months – please recharge.", type: "warning" },
];


// Chart.js dummy configs
const performanceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Deposits",
      data: [100, 200, 150, 300, 250, 400, 350],
      backgroundColor: "rgba(0, 123, 255, 0.7)",
      borderColor: "#007bff",
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: "Withdrawals",
      data: [50, 80, 60, 120, 90, 130, 100],
      backgroundColor: "rgba(255, 99, 132, 0.7)",
      borderColor: "#ff6384",
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

const pieData = {
  labels: ["Deposits", "Withdrawals"],
  datasets: [
    {
      data: [750, 630],
      backgroundColor: ["#28a745", "#ffc107"],
      hoverBackgroundColor: ["#218838", "#e0a800"],
      borderWidth: 2,
    },
  ],
};

const SaverDashboard = () => {
  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "",
    accountNumber: "",
    avatar: "/assets/avatar.png",
    online: true,
  });
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchUser = axios.get("http://localhost/server/user.php", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fetchBalance = axios.get(
      "http://localhost/server/savedashboard/balance.php",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    Promise.all([fetchUser, fetchBalance])
      .then(([userRes, balRes]) => {
        setUser((u) => {
          // Update localStorage with the latest name
          localStorage.setItem("userName", userRes.data.name);
          return {
            ...u,
            name: userRes.data.name,
            accountNumber: userRes.data.accountNumber,
          };
        });
        setBalance(
          typeof balRes.data.balance === "number" ? balRes.data.balance : 0
        );
        setTransactions(
          Array.isArray(balRes.data.transactions)
            ? balRes.data.transactions
            : []
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleWithdraw = () => {
    if (!selectedGroup) {
      alert("Please select a group to withdraw from.");
      return;
    }
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost/server/savedashboard/withdraw.php",
        { amount: withdrawAmount, group_id: selectedGroup },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        alert(response.data.message);
        setBalance((prev) => prev - parseFloat(withdrawAmount));
        setWithdrawAmount("");
      })
      .catch((error) =>
        alert(error.response?.data?.message || "Error withdrawing money.")
      );
  };

  if (loading) return <div>Loading...</div>;

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
              <span
                className={`status-dot ${user.online ? "online" : "offline"}`}
              ></span>
              <span>{user.online ? "Online" : "Offline"}</span>
            </div>
            <ul className="sidebar-menu">
              <li className={location.pathname === "/deposit" ? "active" : ""} onClick={() => setShowDepositModal(true)}>Deposit</li>
              <li className={location.pathname === "/withdraw" ? "active" : ""} onClick={() => navigate("/withdraw")}>Withdraw</li>
              <li className={location.pathname === "/notifications" ? "active" : ""} onClick={() => navigate("/notifications")}>Notifications</li>
              <li className={location.pathname === "/chat" ? "active" : ""} onClick={() => navigate("/chat")}>Chat</li>
              <li className={location.pathname === "/invites" ? "active" : ""} onClick={() => navigate("/invites")}>Invites</li>
              <li className={location.pathname === "/settings" ? "active" : ""} onClick={() => navigate("/settings")}>Settings</li>
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
                <p className="balance-amount">${(balance || 0).toFixed(2)}</p>
                <div className="balance-actions">
                  <select
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                    className="group-select"
                  >
                    <option value="">Select Group</option>
                    <option value="group1">School Savers</option>
                    <option value="group2">Family Fund</option>
                    <option value="group3">Holiday Club</option>
                  </select>
                  <button className="btn deposit-btn" onClick={() => setShowDepositModal(true)}>
                    Deposit
                  </button>
                  <button className="btn withdraw-btn" onClick={handleWithdraw}>
                    Withdraw
                  </button>
                </div>
              </article>

              {/* Charts Section */}
              <article className="card chart-card">
                <h2>Performance</h2>
                <Bar
                  data={performanceData}
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
                  data={pieData}
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
                  {notifications.slice(0, 3).map((n) => (
                    <li key={n.id}>{n.text}</li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/notifications")}>
                  View Notifications
                </button>
              </article>

              {/* Chat Card */}
              <article className="card chat-card">
                <h2>
                  Chats{" "}
                  <span className="chat-badge">
                    {chats.filter((c) => c.unread).length}
                  </span>
                </h2>
                <ul>
                  {chats.slice(0, 3).map((c) => (
                    <li key={c.id}>
                      <strong>{c.name}:</strong> {c.preview}
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/chat")}>
                  View More
                </button>
              </article>

              {/* Account Cautions Card */}
              <article className="card cautions-card">
                <h2>Account Cautions</h2>
                <ul>
                  {cautions.map((c) => (
                    <li key={c.id} className={`caution-${c.type}`}>
                      {c.text}
                    </li>
                  ))}
                </ul>
              </article>

              {/* Transactions Summary Card */}
              <article className="card transactions-card">
                <h2>Recent Transactions</h2>
                <ul>
                  {transactions.slice(0, 3).map((t) => (
                    <li key={t.id}>
                      <span className={`trans-type ${t.type}`}>{t.type}</span>
                      <span className="trans-amount">${t.amount}</span>
                      <span className="trans-date">{t.date}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/transactions")}>
                  View More
                </button>
              </article>
            </section>
          </main>
        </div>

        {/* Footer - only at the bottom */}
        <footer className="footer">
          <span>&copy; 2024 Trinity SACCO. All rights reserved.</span>
        </footer>
      </div>
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
    </div>
  );
};

export default SaverDashboard;
