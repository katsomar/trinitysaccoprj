import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerTopNav from '../components/ManagerTopNav';
import '../styles/reports.css';
import '../styles/transactions.css';

// Utilities
function amountToWords(amount) {
  // Basic converter for integers up to millions for demo purposes
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function toWords(n) {
    n = Math.floor(n);
    if (n === 0) return 'Zero';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + toWords(n % 100) : '');
    if (n < 1000000) return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
    return toWords(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 ? ' ' + toWords(n % 1000000) : '');
  }

  const [whole, fraction] = amount.toString().split('.');
  let words = toWords(parseInt(whole, 10));
  if (fraction && parseInt(fraction, 10) > 0) {
    words += ` and ${fraction}/100`;
  }
  return words + ' Only';
}

// Placeholder data (frontend-only)
const INITIAL_WITHDRAWALS = [
  { id: 'W-1001', name: 'Alice Johnson', amount: 250, datetime: '2025-07-01 10:15', group: 'A', status: 'pending' },
  { id: 'W-1002', name: 'Bob Lee', amount: 480.5, datetime: '2025-07-02 13:40', group: 'A', status: 'pending' },
  { id: 'W-1003', name: 'Grace Hopper', amount: 1200, datetime: '2025-07-03 09:05', group: 'B', status: 'pending' },
];
const INITIAL_DEPOSITS = [
  { id: 'D-3001', name: 'Jane Doe', amount: 150, datetime: '2025-07-01 11:20', group: 'A', status: 'pending' },
  { id: 'D-3002', name: 'John Smith', amount: 950, datetime: '2025-07-03 16:00', group: 'B', status: 'pending' },
  { id: 'D-3003', name: 'Mary Ann', amount: 60, datetime: '2025-07-04 08:15', group: 'A', status: 'pending' },
];

export default function Reports() {
  const navigate = useNavigate();

  // UI State
  const [activeTab, setActiveTab] = useState('withdrawals'); // 'withdrawals' | 'deposits'
  const [selectedGroup, setSelectedGroup] = useState('A'); // 'A' | 'B'

  // Data State
  const [pendingWithdrawals, setPendingWithdrawals] = useState(INITIAL_WITHDRAWALS);
  const [approvedWithdrawals, setApprovedWithdrawals] = useState([]); // {id, name, amount, date, time, status, reportSent}

  const [pendingDeposits, setPendingDeposits] = useState(INITIAL_DEPOSITS);
  const [approvedDeposits, setApprovedDeposits] = useState([]); // {id, name, amount, date, time, status, reportSent}

  // Modals
  const [showApprovedModal, setShowApprovedModal] = useState(null); // null | 'withdrawals' | 'deposits'
  const [showConfirmModal, setShowConfirmModal] = useState(false); // ask send report?
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const approvedWithdrawalsBtnRef = useRef(null);
  const approvedDepositsBtnRef = useRef(null);

  // Selection
  const [selectedRequest, setSelectedRequest] = useState(null); // request object (pending or approved)
  const [selectedFromApproved, setSelectedFromApproved] = useState(false); // whether selected item originates from approved table

  // Animations
  const [fadingIds, setFadingIds] = useState(new Set());

  // Pagination
  const PAGE_SIZE = 5;
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [depositsPage, setDepositsPage] = useState(1);

  // Derived filtered lists by group
  const filteredPendingWithdrawals = useMemo(
    () => pendingWithdrawals.filter(r => r.group === selectedGroup),
    [pendingWithdrawals, selectedGroup]
  );
  const filteredPendingDeposits = useMemo(
    () => pendingDeposits.filter(r => r.group === selectedGroup),
    [pendingDeposits, selectedGroup]
  );
  const filteredApprovedWithdrawals = useMemo(
    () => approvedWithdrawals.filter(r => r.group === selectedGroup),
    [approvedWithdrawals, selectedGroup]
  );
  const filteredApprovedDeposits = useMemo(
    () => approvedDeposits.filter(r => r.group === selectedGroup),
    [approvedDeposits, selectedGroup]
  );

  function handleGroupChange(e) {
    setSelectedGroup(e.target.value);
    // reset pagination when group changes
    setWithdrawalsPage(1);
    setDepositsPage(1);
  }

  function animateAndRemove(id, type) {
    setFadingIds(prev => new Set([...prev, id]));
    setTimeout(() => {
      setFadingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (type === 'withdrawals') {
        setPendingWithdrawals(prev => prev.filter(r => r.id !== id));
      } else {
        setPendingDeposits(prev => prev.filter(r => r.id !== id));
      }
    }, 350);
  }

  // Animate the request card shrinking/moving towards the corresponding "View Approved" button,
  // then remove from pending and finalize the approval.
  function flyToApprovedAndFinalize(request, withReport) {
    const cardEl = document.querySelector(`.request-card[data-reqid="${request.id}"]`);
    const targetBtn = request.__type === 'withdrawals' ? approvedWithdrawalsBtnRef.current : approvedDepositsBtnRef.current;

    if (!cardEl || !targetBtn) {
      // Fallback to simple fade-out if elements are not found
      animateAndRemove(request.id, request.__type);
      setTimeout(() => finalizeApproval(request, withReport), 360);
      return;
    }

    const cardRect = cardEl.getBoundingClientRect();
    const targetRect = targetBtn.getBoundingClientRect();

    // Clone a lightweight visual of the card to animate
    const ghost = cardEl.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.left = cardRect.left + 'px';
    ghost.style.top = cardRect.top + 'px';
    ghost.style.width = cardRect.width + 'px';
    ghost.style.height = cardRect.height + 'px';
    ghost.style.margin = '0';
    ghost.style.zIndex = '3000';
    ghost.style.transition = 'transform 420ms cubic-bezier(.22,.61,.36,1), opacity 420ms ease';
    ghost.style.pointerEvents = 'none';
    document.body.appendChild(ghost);

    // Fade the original a bit while the ghost flies
    cardEl.style.transition = 'opacity 280ms ease';
    cardEl.style.opacity = '0.25';

    // Next frame, compute and apply transform
    requestAnimationFrame(() => {
      const toX = targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2);
      const toY = targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2);
      const scale = Math.max(0.25, Math.min(0.4, targetRect.width / cardRect.width));
      ghost.style.transform = `translate(${toX}px, ${toY}px) scale(${scale})`;
      ghost.style.opacity = '0.4';
    });

    const cleanup = () => {
      if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
      animateAndRemove(request.id, request.__type);
      // Finalize immediately after removal is triggered
      setTimeout(() => finalizeApproval(request, withReport), 10);
    };
    ghost.addEventListener('transitionend', cleanup, { once: true });
  }

  function approveRequest(request, type) {
    // Open confirmation modal asking to send a report
    setSelectedRequest({ ...request, __type: type });
    setSelectedFromApproved(false);
    setShowConfirmModal(true);
  }

  function declineRequest(request, type) {
    // TODO: backend integration (decline request)
    animateAndRemove(request.id, type);
  }

  function approveWithoutReport(request, type) {
    // Directly approve without opening confirm modal
    const req = { ...request, __type: type };
    flyToApprovedAndFinalize(req, false);
  }

  function finalizeApproval(request, withReport) {
    // Move from pending to approved, optionally mark reportSent
    const dt = new Date();
    const [dateStr, timeStr] = request.datetime.includes(' ')
      ? request.datetime.split(' ')
      : [dt.toISOString().slice(0,10), dt.toTimeString().slice(0,5)];
    const approvedRecord = {
      id: request.id,
      name: request.name,
      amount: request.amount,
      date: dateStr,
      time: timeStr,
      status: 'Approved',
      reportSent: !!withReport,
      group: request.group,
      __type: request.__type,
    };

    if (request.__type === 'withdrawals') {
      setApprovedWithdrawals(prev => [approvedRecord, ...prev]);
      setPendingWithdrawals(prev => prev.filter(r => r.id !== request.id));
    } else {
      setApprovedDeposits(prev => [approvedRecord, ...prev]);
      setPendingDeposits(prev => prev.filter(r => r.id !== request.id));
    }
  }

  function handleConfirmChoice(sendReport) {
    const req = selectedRequest;
    setShowConfirmModal(false);
    if (!req) return;

    if (sendReport) {
      // Open document preview modal
      setShowDocumentModal(true);
    } else {
      // Directly approve without report with a fly-to-button animation
      flyToApprovedAndFinalize(req, false);
      setSelectedRequest(null);
    }
  }

  function handleSendReport() {
    // TODO: backend integration (send report)
    if (!selectedRequest) return;
    if (selectedFromApproved) {
      // Mark as sent in approved list
      if (selectedRequest.__type === 'withdrawals') {
        setApprovedWithdrawals(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, reportSent: true } : r));
      } else {
        setApprovedDeposits(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, reportSent: true } : r));
      }
      setShowDocumentModal(false);
      setSelectedRequest(null);
      return;
    }

    animateAndRemove(selectedRequest.id, selectedRequest.__type);
    setTimeout(() => {
      finalizeApproval(selectedRequest, true);
      setShowDocumentModal(false);
      setSelectedRequest(null);
    }, 360);
  }

  function handleSaveReport() {
    // TODO: backend integration (save report draft)
    alert('Report saved (mock).');
  }

  function handlePrintReport() {
    // Simple print of the document modal content
    const content = document.getElementById('report-document');
    if (!content) return;
    const pri = window.open('', '', 'width=800,height=600');
    pri.document.write('<html><head><title>Print Report</title>');
    pri.document.write('<style>body{font-family:Segoe UI, Arial, sans-serif;} .doc { padding: 20px; } .doc h2 { margin-top: 0; }</style>');
    pri.document.write('</head><body>');
    pri.document.write(content.innerHTML);
    pri.document.write('</body></html>');
    pri.document.close();
    pri.focus();
    pri.print();
    pri.close();
  }

  function openApprovedModal(type) {
    setShowApprovedModal(type);
    if (type === 'withdrawals') setWithdrawalsPage(1);
    if (type === 'deposits') setDepositsPage(1);
  }

  function pageData(list, page) {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }

  function totalPages(list) {
    return Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  }

  const TabHeader = (
    <div className="reports-header">
      <div className="group-selector">
        <label htmlFor="group">Group:</label>
        <select id="group" value={selectedGroup} onChange={handleGroupChange}>
          <option value="A">Group A</option>
          <option value="B">Group B</option>
        </select>
      </div>
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdrawals')}
        >Withdrawal Confirmations</button>
        <button
          className={`tab-btn ${activeTab === 'deposits' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposits')}
        >Deposit Confirmations</button>
      </div>
    </div>
  );

  const WithdrawalsTab = (
    <div className="tab-content">
      <div className="tab-actions">
        <button id="approved-withdrawals-btn" ref={approvedWithdrawalsBtnRef} className="btn btn-primary" onClick={() => openApprovedModal('withdrawals')}>View Approved Withdrawals</button>
      </div>
      <div className="pending-list">
        {filteredPendingWithdrawals.length === 0 && (
          <div className="empty-state">No pending withdrawal requests for this group.</div>
        )}
        {filteredPendingWithdrawals.map(req => (
          <div key={req.id} data-reqid={req.id} className={`request-card ${fadingIds.has(req.id) ? 'fade-out' : ''}`}>
            <div className="request-info">
              <div className="request-meta">
                <span className="status-badge pending">Pending</span>
                <span className="req-id">#{req.id}</span>
              </div>
              <div className="request-title">{req.name}</div>
              <div className="request-sub">Amount: ${req.amount.toLocaleString()} • Date: {req.datetime}</div>
            </div>
            <div className="request-actions">
              <button className="btn btn-secondary" onClick={() => declineRequest(req, 'withdrawals')}>Decline</button>
              <button className="btn btn-primary" onClick={() => approveWithoutReport(req, 'withdrawals')}>Approve</button>
              <button className="btn btn-primary outline" onClick={() => approveRequest(req, 'withdrawals')}>Confirm</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DepositsTab = (
    <div className="tab-content">
      <div className="tab-actions">
        <button id="approved-deposits-btn" ref={approvedDepositsBtnRef} className="btn btn-primary" onClick={() => openApprovedModal('deposits')}>View Approved Deposits</button>
      </div>
      <div className="pending-list">
        {filteredPendingDeposits.length === 0 && (
          <div className="empty-state">No pending deposit requests for this group.</div>
        )}
        {filteredPendingDeposits.map(req => (
          <div key={req.id} data-reqid={req.id} className={`request-card ${fadingIds.has(req.id) ? 'fade-out' : ''}`}>
            <div className="request-info">
              <div className="request-meta">
                <span className="status-badge pending">Pending</span>
                <span className="req-id">#{req.id}</span>
              </div>
              <div className="request-title">{req.name}</div>
              <div className="request-sub">Amount: ${req.amount.toLocaleString()} • Date: {req.datetime}</div>
            </div>
            <div className="request-actions">
              <button className="btn btn-secondary" onClick={() => declineRequest(req, 'deposits')}>Decline</button>
              <button className="btn btn-primary" onClick={() => approveWithoutReport(req, 'deposits')}>Approve</button>
              <button className="btn btn-primary outline" onClick={() => approveRequest(req, 'deposits')}>Confirm</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ApprovedTableModal = (
    showApprovedModal && (
      <div className="modal-overlay" onClick={() => setShowApprovedModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{showApprovedModal === 'withdrawals' ? 'Approved Withdrawals' : 'Approved Deposits'}</h3>
            <button className="close-btn" onClick={() => setShowApprovedModal(null)}>×</button>
          </div>
          <div className="modal-body table-body">
            <table className="approved-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Request No.</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                {(showApprovedModal === 'withdrawals'
                  ? pageData(filteredApprovedWithdrawals, withdrawalsPage)
                  : pageData(filteredApprovedDeposits, depositsPage)
                ).map(row => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.time}</td>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>${row.amount.toLocaleString()}</td>
                    <td>{row.status}</td>
                    <td>
                      {row.reportSent ? (
                        <span className="sent">Sent</span>
                      ) : (
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => { setSelectedRequest({ ...row, __type: showApprovedModal }); setSelectedFromApproved(true); setShowDocumentModal(true); }}
                        >Send Report</button>
                      )}
                    </td>
                  </tr>
                ))}
                {((showApprovedModal === 'withdrawals' && filteredApprovedWithdrawals.length === 0) ||
                  (showApprovedModal === 'deposits' && filteredApprovedDeposits.length === 0)) && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: '#666' }}>No records yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-footer pagination">
            {showApprovedModal === 'withdrawals' ? (
              <>
                <button className="btn btn-secondary"
                        disabled={withdrawalsPage <= 1}
                        onClick={() => setWithdrawalsPage(p => Math.max(1, p - 1))}>Prev</button>
                <span className="page-indicator">Page {withdrawalsPage} of {totalPages(filteredApprovedWithdrawals)}</span>
                <button className="btn btn-secondary"
                        disabled={withdrawalsPage >= totalPages(filteredApprovedWithdrawals)}
                        onClick={() => setWithdrawalsPage(p => Math.min(totalPages(filteredApprovedWithdrawals), p + 1))}>Next</button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary"
                        disabled={depositsPage <= 1}
                        onClick={() => setDepositsPage(p => Math.max(1, p - 1))}>Prev</button>
                <span className="page-indicator">Page {depositsPage} of {totalPages(filteredApprovedDeposits)}</span>
                <button className="btn btn-secondary"
                        disabled={depositsPage >= totalPages(filteredApprovedDeposits)}
                        onClick={() => setDepositsPage(p => Math.min(totalPages(filteredApprovedDeposits), p + 1))}>Next</button>
              </>
            )}
            <button className="btn btn-secondary" onClick={() => setShowApprovedModal(null)}>Close</button>
          </div>
        </div>
      </div>
    )
  );

  const ConfirmModal = (
    showConfirmModal && selectedRequest && (
      <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
        <div className="modal small" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Confirmation</h3>
            <button className="close-btn" onClick={() => setShowConfirmModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <p>Would you like to send a report?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            <button className="btn btn-secondary" onClick={() => handleConfirmChoice(false)}>No</button>
            <button className="btn btn-primary" onClick={() => handleConfirmChoice(true)}>Yes</button>
          </div>
        </div>
      </div>
    )
  );

  const DocumentPreviewModal = (
    showDocumentModal && selectedRequest && (
      <div className="modal-overlay" onClick={() => setShowDocumentModal(false)}>
        <div className="modal doc" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Document Preview</h3>
            <button className="close-btn" onClick={() => setShowDocumentModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div id="report-document" className="document">
              <div className="doc-header">
                <img src="/src/assets/images/logo.png" alt="Logo" className="doc-logo" />
                <div className="doc-title">
                  <div className="doc-group">{selectedGroup === 'A' ? 'Group A' : 'Group B'}</div>
                  <h2>{selectedRequest.__type === 'withdrawals' ? 'Withdrawal Report' : 'Deposit Report'}</h2>
                </div>
              </div>
              <div className="doc-meta">
                <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Time:</strong> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div><strong>Request No.:</strong> {selectedRequest.id}</div>
              </div>
              <div className="doc-body">
                <div className="row"><span>Requester Name:</span><strong>{selectedRequest.name}</strong></div>
                <div className="row"><span>Amount (numeric):</span><strong>${selectedRequest.amount.toLocaleString()}</strong></div>
                <div className="row"><span>Amount (in words):</span><strong>{amountToWords(selectedRequest.amount)}</strong></div>
                {selectedRequest.__type === 'withdrawals' ? (
                  <p className="statement">Approved by Manager Jane as per group policy. Signature: <span className="signature">Manager Jane</span></p>
                ) : (
                  <p className="statement">Received by Manager Jane. Signature: <span className="signature">Manager Jane</span></p>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowDocumentModal(false)}>Close</button>
            <button className="btn btn-secondary" onClick={handleSaveReport}>Save</button>
            <button className="btn btn-secondary" onClick={handlePrintReport}>Print</button>
            <button className="btn btn-primary" onClick={handleSendReport}>Send</button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="scrollable-page">
      <div className="saver-dashboard reports-root">
        {/* Top Navigation */}
        <ManagerTopNav />

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
              <img src="/src/assets/images/logo.png" alt="Trinity SACCO" />
              <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
            </div>
          </aside>

          {/* Content */}
          <main className="main-content">
            <div className="tx-header-row">
              <h1 className="tx-title">Reports</h1>
              <div className="tx-header-actions">
                <button className="btn tx-back-btn" onClick={() => navigate("/manager-dashboard")}>Back to Dashboard</button>
              </div>
            </div>
            <section className="reports-container card">
                            {TabHeader}
              {activeTab === 'withdrawals' ? WithdrawalsTab : DepositsTab}
            </section>
          </main>
        </div>

        {/* Footer (reusing global footer style) */}
        <footer className="footer">
          <span>&copy; 2025 Trinity SACCO. All rights reserved.</span>
        </footer>
      </div>

      {/* Modals */}
      {ApprovedTableModal}
      {ConfirmModal}
      {DocumentPreviewModal}
    </div>
  );
}
