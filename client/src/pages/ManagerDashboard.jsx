import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/SaverDashboard.css"; // Reuse the same theme

const user = {
  name: "Manager Jane",
  accountNumber: "SACCO20250717002",
  avatar: "/assets/manager-avatar.png",
  online: true,
};

const groupStats = {
  totalSavings: 12500,
  totalMembers: 24,
  activeMembers: 18,
  interestRate: 7.5,
};

const members = [
  { id: 1, name: "Kats Omar", avatar: "/assets/avatar1.png" },
  { id: 2, name: "Alex Kim", avatar: "/assets/avatar2.png" },
  { id: 3, name: "Sarah Lee", avatar: "/assets/avatar3.png" },
  { id: 4, name: "John Doe", avatar: "/assets/avatar4.png" },
];

const contributions = [
  { id: 1, member: "Kats Omar", amount: 200, date: "2024-07-10" },
  { id: 2, member: "Sarah Lee", amount: 150, date: "2024-07-09" },
  { id: 3, member: "Alex Kim", amount: 300, date: "2024-07-08" },
];

const transactions = [
  { id: 1, type: "deposit", member: "Kats Omar", amount: 200, date: "2024-07-10" },
  { id: 2, type: "withdrawal", member: "Sarah Lee", amount: 100, date: "2024-07-09" },
  { id: 3, type: "deposit", member: "Alex Kim", amount: 300, date: "2024-07-08" },
];

const notifications = [
  { id: 1, text: "New withdrawal request from Sarah Lee." },
  { id: 2, text: "Interest rate updated to 7.5%." },
  { id: 3, text: "Monthly report is ready for download." },
];

const chats = [
  { id: 1, name: "Group: School Savers", preview: "Let's meet tomorrow.", unread: true },
  { id: 2, name: "Kats Omar", preview: "Deposit confirmed.", unread: false },
  { id: 3, name: "Alex Kim", preview: "Can I withdraw?", unread: true },
];

const withdrawalRequests = [
  { id: 1, member: "Sarah Lee", amount: 100, date: "2024-07-09", status: "pending" },
  { id: 2, member: "Alex Kim", amount: 150, date: "2024-07-08", status: "pending" },
  { id: 3, member: "John Doe", amount: 80, date: "2024-07-07", status: "pending" },
];

// Chart.js dummy configs
const barData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Group Deposits",
      data: [1200, 1500, 1100, 1800, 1700, 2000, 1700],
      backgroundColor: "rgba(0, 123, 255, 0.7)",
      borderColor: "#007bff",
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: "Group Withdrawals",
      data: [600, 800, 700, 900, 850, 1000, 950],
      backgroundColor: "rgba(255, 99, 132, 0.7)",
      borderColor: "#ff6384",
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Savings Growth",
      data: [5000, 6500, 8000, 9000, 10500, 12000, 12500],
      fill: false,
      borderColor: "#28a745",
      backgroundColor: "rgba(40,167,69,0.2)",
      tension: 0.4,
    },
  ],
};

const pieData = {
  labels: ["Deposits", "Withdrawals"],
  datasets: [
    {
      data: [12000, 7000],
      backgroundColor: ["#28a745", "#ffc107"],
      hoverBackgroundColor: ["#218838", "#e0a800"],
      borderWidth: 2,
    },
  ],
};

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("bar");
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // Auto-scroll member showcase
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % (members.length - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
              <span className={`status-dot ${user.online ? "online" : "offline"}`}></span>
              <span>{user.online ? "Online" : "Offline"}</span>
            </div>
            <ul className="sidebar-menu">
              <li onClick={() => navigate("/members")}>Members</li>
              <li onClick={() => navigate("/transactions")}>Transactions</li>
              <li onClick={() => navigate("/groups")}>Groups</li>
              <li onClick={() => navigate("/interest-calculator")}>Interest Calculator</li>
              <li onClick={() => navigate("/reports")}>Reports</li>
              <li onClick={() => navigate("/messages")}>Messages</li>
              <li onClick={() => navigate("/settings")}>Settings</li>
            </ul>
            <div className="sidebar-logo">
              <img src="/src/assets/images/logo.png" alt="Trinity SACCO" style={{ filter: "grayscale(100%)", opacity: 0.65 }}/>
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
              {/* Card 1: Account Balance */}
              <article className="card balance-card">
                <h2>Group Savings</h2>
                <p className="balance-amount">${groupStats.totalSavings.toLocaleString()}</p>
                <div className="balance-actions">
                  <button className="btn deposit-btn" onClick={() => navigate("/deposit")}>
                    Deposit
                  </button>
                  <button className="btn withdraw-btn" onClick={() => navigate("/withdraw")}>
                    Withdraw
                  </button>
                </div>
              </article>

              {/* Card 2: Line/Bar Chart */}
              <article className="card chart-card">
                <h2>Savings Performance</h2>
                {chartType === "bar" ? (
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      animation: { duration: 1500, easing: "easeInOutQuart" },
                      plugins: { legend: { display: true, position: "bottom" } },
                    }}
                    className="dashboard-chart"
                  />
                ) : (
                  <Line
                    data={lineData}
                    options={{
                      responsive: true,
                      animation: { duration: 1500, easing: "easeInOutQuart" },
                      plugins: { legend: { display: true, position: "bottom" } },
                    }}
                    className="dashboard-chart"
                  />
                )}
                <div className="chart-toggle-btns" style={{ marginTop: "1rem", display: "flex", gap: "0.7rem", justifyContent: "center" }}>
                  <button
                    className="btn"
                    onClick={() => setChartType("bar")}
                  >
                    Bar
                  </button>
                  <button
                    className="btn"
                    onClick={() => setChartType("line")}
                  >
                    Line
                  </button>
                </div>
              </article>

              {/* Card 3: Pie Chart */}
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

              {/* Card 4: Total Members */}
              <article className="card">
                <h2>Total Members</h2>
                <p style={{ fontSize: "2rem", color: "#007bff", fontWeight: 700 }}>
                  {groupStats.totalMembers}
                </p>
              </article>

              {/* Card 5: Member Activity */}
              <article className="card">
                <h2>Active Members</h2>
                <p style={{ fontSize: "1.5rem", color: "#28a745", fontWeight: 600 }}>
                  {groupStats.activeMembers}
                </p>
              </article>

              {/* Card 6: Interest Rate */}
              <article className="card">
                <h2>Interest Rate</h2>
                <p style={{ fontSize: "1.5rem", color: "#ffc107", fontWeight: 600 }}>
                  {groupStats.interestRate}% per month
                </p>
                <button className="btn" onClick={() => navigate("/interest-calculator")}>
                  Change Rate
                </button>
              </article>

              {/* Card 7: Member Showcase */}
              <article className="card">
                <h2>Member Showcase</h2>
                <div className="member-showcase">
                  {members.slice(showcaseIndex, showcaseIndex + 3).map((m) => (
                    <div key={m.id} className="member-card">
                      <img src={m.avatar} alt={m.name} className="avatar" />
                      <span>{m.name}</span>
                    </div>
                  ))}
                </div>
                <button className="btn" onClick={() => navigate("/members")}>
                  View More
                </button>
              </article>

              {/* Card 8: Members’ Contributions */}
              <article className="card">
                <h2>Latest Contributions</h2>
                <ul>
                  {contributions.slice(0, 3).map((c) => (
                    <li key={c.id}>
                      <strong>{c.member}</strong>: ${c.amount} on {c.date}
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/contributions")}>
                  View More
                </button>
              </article>

              {/* Card 9: Recent Transactions */}
              <article className="card transactions-card">
                <h2>Recent Transactions</h2>
                <ul>
                  {transactions.slice(0, 3).map((t) => (
                    <li key={t.id}>
                      <span className={`trans-type ${t.type}`}>{t.type}</span>
                      <span className="trans-amount">${t.amount}</span>
                      <span className="trans-date">{t.date}</span>
                      <span className="trans-member">{t.member}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* Card 10: Notifications */}
              <article className="card notifications-card">
                <h2>Notifications</h2>
                <ul>
                  {notifications.slice(0, 3).map((n) => (
                    <li key={n.id}>{n.text}</li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/notifications")}>
                  View More
                </button>
              </article>

              {/* Card 11: Group Chats */}
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
                <div style={{ display: "flex", gap: "0.7rem" }}>
                  <button className="btn" onClick={() => navigate("/messages")}>
                    Send Message
                  </button>
                  <button className="btn" onClick={() => navigate("/messages")}>
                    View Messages
                  </button>
                </div>
              </article>

              {/* Card 12: Withdrawal Requests */}
              <article className="card">
                <h2>Withdrawal Requests</h2>
                <ul>
                  {withdrawalRequests.slice(0, 3).map((w) => (
                    <li key={w.id}>
                      <strong>{w.member}</strong>: ${w.amount} on {w.date} <span style={{ color: "#ffc107" }}>{w.status}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => navigate("/withdrawal-requests")}>
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
    </div>
  );
};

export default ManagerDashboard;
