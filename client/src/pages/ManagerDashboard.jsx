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
          <input type="text" className="search-bar" placeholder="Search..." />
          <button className="discover-btn" onClick={() => navigate("/discover")}>Discover</button>
        </div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="online-status">
            <span className={`status-dot ${user.is_online ? "online" : "offline"}`}></span>
            <span>{user.is_online ? "Online" : "Offline"}</span>
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
        </aside>

        <main className="main-content">
          <section className="greeting-section">
            <h1>Welcome, {user.name}</h1>
            <p>Account Number: <span className="account-number">{user.account_number}</span></p>
          </section>

          <section className="cards-grid">
            {/* Add the same card components as before using the destructured variables */}
            {/* Example: */}
            <article className="card balance-card">
              <h2>Group Savings</h2>
              <p className="balance-amount">${groupStats.total_savings?.toLocaleString()}</p>
            </article>

            <article className="card chart-card">
              <h2>Savings Performance</h2>
              {chartType === "bar" ? (
                <Bar data={barData} />
              ) : (
                <Line data={lineData} />
              )}
              <div className="chart-toggle-btns">
                <button className="btn" onClick={() => setChartType("bar")}>Bar</button>
                <button className="btn" onClick={() => setChartType("line")}>Line</button>
              </div>
            </article>

            <article className="card chart-card">
              <h2>Deposits vs Withdrawals</h2>
              <Pie data={pieData} />
            </article>
          </section>
        </main>
      </div>

      <footer className="footer">
        <span>&copy; 2024 Trinity SACCO. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default ManagerDashboard;
