import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagerTopNav from "../components/ManagerTopNav";
import "../styles/transactions.css";
import "../styles/GroupView.css"; // for shared back button styling

// Mock transaction data by manager groups (can mirror saver for now)
const MOCK_DATA = {
  education: [
    { id: 1, date: "2024-07-21", time: "09:30", type: "Deposit", amount: 1200.0, balanceAfter: 151200.0 },
    { id: 2, date: "2024-07-20", time: "10:05", type: "Withdrawal", amount: 300.0, balanceAfter: 150000.0 },
    { id: 3, date: "2024-07-19", time: "12:44", type: "Contribution", amount: 800.0, balanceAfter: 150300.0 },
    { id: 4, date: "2024-07-18", time: "14:10", type: "Fees", amount: 50.0, balanceAfter: 149500.0 },
    { id: 5, date: "2024-07-17", time: "16:00", type: "Deposit", amount: 2000.0, balanceAfter: 149550.0 },
    { id: 6, date: "2024-07-16", time: "08:20", type: "Withdrawal", amount: 500.0, balanceAfter: 147550.0 },
    { id: 7, date: "2024-07-15", time: "10:20", type: "Deposit", amount: 1200.0, balanceAfter: 148050.0 },
    { id: 8, date: "2024-07-14", time: "09:10", type: "Contribution", amount: 600.0, balanceAfter: 146850.0 },
    { id: 9, date: "2024-07-13", time: "15:40", type: "Withdrawal", amount: 200.0, balanceAfter: 146250.0 },
    { id: 10, date: "2024-07-12", time: "11:33", type: "Deposit", amount: 1400.0, balanceAfter: 146450.0 },
    { id: 11, date: "2024-07-11", time: "17:02", type: "Contribution", amount: 900.0, balanceAfter: 145050.0 },
    { id: 12, date: "2024-07-10", time: "13:27", type: "Deposit", amount: 1000.0, balanceAfter: 144150.0 },
  ],
  business: [
    { id: 1, date: "2024-07-20", time: "10:00", type: "Deposit", amount: 900.0, balanceAfter: 8900.0 },
    { id: 2, date: "2024-07-19", time: "09:50", type: "Withdrawal", amount: 150.0, balanceAfter: 8000.0 },
    { id: 3, date: "2024-07-18", time: "12:10", type: "Contribution", amount: 300.0, balanceAfter: 8150.0 },
    { id: 4, date: "2024-07-18", time: "12:30", type: "Fees", amount: 20.0, balanceAfter: 7850.0 },
    { id: 5, date: "2024-07-17", time: "16:47", type: "Deposit", amount: 700.0, balanceAfter: 7870.0 },
    { id: 6, date: "2024-07-16", time: "11:22", type: "Withdrawal", amount: 200.0, balanceAfter: 7170.0 },
    { id: 7, date: "2024-07-15", time: "15:05", type: "Deposit", amount: 500.0, balanceAfter: 7370.0 },
  ],
};

const GROUPS = [
  { id: "education", name: "Education Fund" },
  { id: "business", name: "Business Group" },
];

export default function ManagerTransactions() {
  const navigate = useNavigate();

  // Simulated selected group
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[0].id);

  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Pagination
  const ROWS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Derived data
  const allTx = useMemo(() => {
    const base = MOCK_DATA[selectedGroup] || [];
    return [...base].sort((a, b) => {
      if (a.date === b.date) return b.time.localeCompare(a.time);
      return b.date.localeCompare(a.date);
    });
  }, [selectedGroup]);

  const filteredTx = useMemo(() => {
    return allTx.filter((tx) => {
      const byDate = dateFilter ? tx.date === dateFilter : true;
      const byType = typeFilter === "All" ? true : tx.type === typeFilter;
      return byDate && byType;
    });
  }, [allTx, dateFilter, typeFilter]);

  useEffect(() => { setCurrentPage(1); }, [selectedGroup, dateFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTx.length / ROWS_PER_PAGE));
  const pageStart = (currentPage - 1) * ROWS_PER_PAGE;
  const pageTx = filteredTx.slice(pageStart, pageStart + ROWS_PER_PAGE);

  function goToPage(p) { if (p < 1 || p > totalPages) return; setCurrentPage(p); }
  function handlePrint() { window.print(); }

  return (
    <div className="transactions-root">
      {/* Top Navigation - same as ManagerDiscover via ManagerTopNav */}
      <ManagerTopNav />

      <main className="transactions-main">
        <div className="tx-header-row">
          <h1 className="tx-title">Transactions</h1>
          <div className="tx-header-actions">
            <button className="btn tx-back-btn" onClick={() => navigate("/manager-dashboard")}>Back to Dashboard</button>
            <button className="btn tx-print-btn" onClick={handlePrint}>Print Current Page</button>
          </div>
        </div>

        {/* Group selector and filters */}
        <section className="tx-filters">
          <div className="tx-filter-item">
            <label htmlFor="tx-group">Group</label>
            <select
              id="tx-group"
              className="tx-select"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {GROUPS.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="tx-filter-item">
            <label htmlFor="tx-date">Date</label>
            <input
              id="tx-date"
              type="date"
              className="tx-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="tx-filter-item">
            <label htmlFor="tx-type">Type</label>
            <select
              id="tx-type"
              className="tx-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {[
                "All",
                "Deposit",
                "Withdrawal",
                "Contribution",
                "Fees",
              ].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="tx-filter-actions">
            <button className="btn tx-search-btn" onClick={() => setCurrentPage(1)}>Search</button>
            <button className="btn tx-clear-btn" onClick={() => { setDateFilter(""); setTypeFilter("All"); }}>Clear</button>
          </div>
        </section>

        {/* Table */}
        <section className="tx-table-card">
          <div className="tx-table-wrapper">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Transaction Type</th>
                  <th className="tx-right">Amount</th>
                  <th className="tx-right">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {pageTx.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="tx-empty">No transactions found.</td>
                  </tr>
                ) : (
                  pageTx.map((tx) => (
                    <tr key={`${selectedGroup}-${tx.id}`}>
                      <td>{tx.date}</td>
                      <td>{tx.time}</td>
                      <td>{tx.type}</td>
                      <td className="tx-right">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="tx-right">${tx.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination */}
        <section className="tx-pagination">
          <button className="tx-page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <div className="tx-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`tx-page-num${p === currentPage ? " active" : ""}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="tx-page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </section>
      </main>
    </div>
  );
}
