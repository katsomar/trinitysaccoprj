import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagerTopNav from "../components/ManagerTopNav";
import "../styles/members.css";
import "../styles/transactions.css";

// Mock data for groups and members
const mockGroups = [
  {
    id: "business",
    name: "Business Investment Group",
    members: [
      {
        id: 101,
        name: "John Doe",
        email: "john@example.com",
        phone: "256700123456",
        totalDeposited: 5000,
        totalWithdrawn: 2000,
        depositsCount: 8,
        withdrawalsCount: 3,
        transactions: [
          { id: 1, type: "Deposit", amount: 800, date: "2024-07-20", time: "09:12" },
          { id: 2, type: "Withdrawal", amount: 200, date: "2024-07-18", time: "12:30" },
          { id: 3, type: "Deposit", amount: 600, date: "2024-07-15", time: "10:20" },
          { id: 4, type: "Deposit", amount: 900, date: "2024-07-12", time: "15:40" },
          { id: 5, type: "Deposit", amount: 500, date: "2024-07-10", time: "08:55" },
        ],
      },
      {
        id: 102,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "256701234567",
        totalDeposited: 8000,
        totalWithdrawn: 1000,
        depositsCount: 12,
        withdrawalsCount: 1,
        transactions: [
          { id: 1, type: "Deposit", amount: 1200, date: "2024-07-20", time: "11:00" },
          { id: 2, type: "Deposit", amount: 700, date: "2024-07-16", time: "13:20" },
          { id: 3, type: "Withdrawal", amount: 300, date: "2024-07-12", time: "09:45" },
          { id: 4, type: "Deposit", amount: 500, date: "2024-07-10", time: "16:30" },
          { id: 5, type: "Deposit", amount: 650, date: "2024-07-08", time: "10:05" },
        ],
      },
      {
        id: 104,
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "256703111222",
        totalDeposited: 3200,
        totalWithdrawn: 500,
        depositsCount: 7,
        withdrawalsCount: 1,
        transactions: [
          { id: 1, type: "Deposit", amount: 400, date: "2024-07-19", time: "14:20" },
          { id: 2, type: "Deposit", amount: 500, date: "2024-07-17", time: "08:22" },
          { id: 3, type: "Deposit", amount: 300, date: "2024-07-12", time: "12:12" },
        ],
      },
    ],
  },
  {
    id: "school",
    name: "School Fees Saving Group",
    members: [
      {
        id: 103,
        name: "Michael Adams",
        email: "mike@example.com",
        phone: "256702345678",
        totalDeposited: 3000,
        totalWithdrawn: 1500,
        depositsCount: 6,
        withdrawalsCount: 2,
        transactions: [
          { id: 1, type: "Deposit", amount: 500, date: "2024-07-20", time: "10:30" },
          { id: 2, type: "Withdrawal", amount: 400, date: "2024-07-16", time: "09:40" },
          { id: 3, type: "Deposit", amount: 450, date: "2024-07-12", time: "16:05" },
          { id: 4, type: "Deposit", amount: 350, date: "2024-07-09", time: "13:58" },
          { id: 5, type: "Deposit", amount: 300, date: "2024-07-06", time: "12:10" },
        ],
      },
      {
        id: 105,
        name: "Robert Lee",
        email: "robert@example.com",
        phone: "256705333444",
        totalDeposited: 1500,
        totalWithdrawn: 200,
        depositsCount: 4,
        withdrawalsCount: 1,
        transactions: [
          { id: 1, type: "Deposit", amount: 300, date: "2024-07-20", time: "10:03" },
          { id: 2, type: "Deposit", amount: 400, date: "2024-07-18", time: "11:40" },
          { id: 3, type: "Withdrawal", amount: 200, date: "2024-07-13", time: "14:12" },
          { id: 4, type: "Deposit", amount: 250, date: "2024-07-11", time: "09:50" },
        ],
      },
    ],
  },
];

export default function Members() {
  const navigate = useNavigate();

  // Selection state
  const [groupId, setGroupId] = useState(mockGroups[0].id);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(() => new Set());

  const ROWS_PER_PAGE = 10;

  const currentGroup = useMemo(() => mockGroups.find(g => g.id === groupId) || mockGroups[0], [groupId]);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return currentGroup.members;
    return currentGroup.members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q))
    );
  }, [currentGroup, search]);

  useEffect(() => { setCurrentPage(1); }, [groupId, search]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / ROWS_PER_PAGE));
  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const pageMembers = filteredMembers.slice(start, start + ROWS_PER_PAGE);

  function goToPage(p) { if (p < 1 || p > totalPages) return; setCurrentPage(p); }
  function toggleExpand(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // Mock actions
  const [modal, setModal] = useState({ open: false, action: null, member: null });
  function openModal(action, member) { setModal({ open: true, action, member }); }
  function closeModal() { setModal({ open: false, action: null, member: null }); }
  function confirmModal() { alert(`${modal.action} executed for ${modal.member.name} (mock)`); closeModal(); }

  return (
    <div className="members-root">
      {/* Top NavBar (same as ManagerDashboard) */}
      <ManagerTopNav />

      <main className="members-main">
        {/* Header */}
        <div className="members-header-row">
          <h1 className="members-title">Group Members</h1>
          <div className="members-header-actions">
            <button className="btn tx-back-btn" onClick={() => navigate("/manager-dashboard")}>Back to Dashboard</button>
          </div>
        </div>

        {/* Controls */}
        <section className="members-controls">
          <div className="members-group-select">
            <label htmlFor="members-group">Group</label>
            <select id="members-group" value={groupId} onChange={e => setGroupId(e.target.value)}>
              {mockGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="members-count">Total Members: <strong>{currentGroup.members.length}</strong></div>
          <div className="members-search">
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn" onClick={() => setCurrentPage(1)}>Search</button>
            <button className="btn members-clear-btn" onClick={() => { setSearch(""); setCurrentPage(1); }}>Clear</button>
          </div>
        </section>

        {/* Members Table */}
        <section className="members-table-card">
          <div className="members-table-wrapper">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Phone / Email</th>
                  <th className="right">Total Deposited</th>
                  <th className="right">Total Withdrawn</th>
                  <th className="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="members-empty">No members found.</td>
                  </tr>
                ) : pageMembers.map(m => (
                  <React.Fragment key={m.id}>
                    <tr className="members-row" onClick={() => toggleExpand(m.id)}>
                      <td>
                        <div className="members-name-cell">
                          <span className={`expand-icon${expanded.has(m.id) ? " open" : ""}`}>▸</span>
                          {m.name}
                        </div>
                      </td>
                      <td>
                        <div className="muted">{m.phone}</div>
                        <div className="muted">{m.email}</div>
                      </td>
                      <td className="right">${m.totalDeposited.toLocaleString()}</td>
                      <td className="right">${m.totalWithdrawn.toLocaleString()}</td>
                      <td className="center" onClick={e => e.stopPropagation()}>
                        <button className="btn btn-warn" onClick={() => openModal("Send Warning", m)}>Send Warning</button>
                        <button className="btn btn-remove" onClick={() => openModal("Remove Member", m)}>Remove</button>
                      </td>
                    </tr>
                    <tr className={`members-expand-row${expanded.has(m.id) ? " open" : ""}`}>
                      <td colSpan={5}>
                        <div className="members-expand">
                          <div className="members-expand-stats">
                            <div><strong>Deposits:</strong> {m.depositsCount}</div>
                            <div><strong>Withdrawals:</strong> {m.withdrawalsCount}</div>
                          </div>
                          {m.transactions && m.transactions.length > 0 && (
                            <div className="members-expand-trans">
                              <div className="members-expand-title">Last 5 Transactions</div>
                              <ul>
                                {m.transactions.slice(0, 5).map(t => (
                                  <li key={t.id}>
                                    <span className={`type ${t.type.toLowerCase()}`}>{t.type}</span>
                                    <span className="amt">${t.amount.toLocaleString()}</span>
                                    <span className="time">{t.date} {t.time}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination */}
        <section className="members-pagination">
          <button className="page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <div className="pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-num${p === currentPage ? " active" : ""}`} onClick={() => goToPage(p)}>{p}</button>
            ))}
          </div>
          <button className="page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </section>
      </main>

      {/* Confirmation Modal */}
      {modal.open && (
        <div className="members-modal-overlay" onClick={closeModal}>
          <div className="members-modal" onClick={e => e.stopPropagation()}>
            <h2>Confirm Action</h2>
            <p>
              Are you sure you want to <strong>{modal.action}</strong> for <strong>{modal.member.name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn" onClick={confirmModal}>Confirm</button>
              <button className="btn btn-remove" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
