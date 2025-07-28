import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "../utils/axiosConfig"; // Make sure this is your axios instance
import "../styles/SaverDashboard.css";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("bar");
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        "http://localhost/server/config/managerdashboard.php",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Dashboard response:", res.data);
      if (res.data.status === "success") {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error or unauthorized. Please login again.");
    } finally {
      setLoading(false);
    }
  };
  fetchDashboard();
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      if (data.members?.length > 3) {
        setShowcaseIndex((prev) => (prev + 1) % (data.members.length - 2));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [data.members]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Destructure safely
  const {
    user = {},
    group_stats: groupStats = {},
    members = [],
    contributions = [],
    transactions = [],
    notifications = [],
    chats = [],
    withdrawal_requests: withdrawalRequests = [],
    bar_data: barData = { labels: [], datasets: [] },
    line_data: lineData = { labels: [], datasets: [] },
    pie_data: pieData = { labels: [], datasets: [] },
  } = data;

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
              <span className={`status-dot ${user.online ? "online" : "offline"}`}></span>
              <span>{user.online ? "Online" : "Offline"}</span>
            </div>
            <ul className="sidebar-menu">
              <li onClick={() => navigate("/members")}>Members</li>
              <li onClick={() => navigate("/transactions")}>Transactions</li>
              <li onClick={() => navigate("/groups")}>Groups</li>
              <li onClick={() => navigate("/interest-calculator")}>Interest Calculator</li>
              <li onClick={() => navigate("/reports")}>Reports</li>
              <li onClick={() => navigate("/manager-notifications")}>Manager Notifications</li>
              <li onClick={() => navigate("/messages")}>Messages</li>
              <li onClick={() => navigate("/manager-settings")}>Settings</li>
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
