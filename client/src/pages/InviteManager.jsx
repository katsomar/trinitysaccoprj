import React, { useState } from 'react';
import '../styles/InviteManager.css';

const mockSentInvites = [
  { id: 1, user: 'saver1@example.com', status: 'pending', date: '2024-07-15' },
  { id: 2, user: 'Alice Johnson', status: 'accepted', date: '2024-07-14' },
  { id: 3, user: 'John Smith', status: 'declined', date: '2024-07-13' },
  { id: 4, user: 'saver2@example.com', status: 'pending', date: '2024-07-12' },
];

const INVITES_PER_PAGE = 9;

const InviteManager = () => {
  const [invites, setInvites] = useState(mockSentInvites);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(invites.length / INVITES_PER_PAGE);

  const handleResend = () => {
    // Simulate resend (could show a toast in real app)
    alert('Invitation resent!');
  };

  const handleCancel = (id) => {
    setInvites((prev) => prev.filter((invite) => invite.id !== id));
  };

  const getStatusClass = (status) => {
    if (status === 'accepted') return 'status-accepted';
    if (status === 'declined') return 'status-declined';
    return 'status-pending';
  };

  // Pagination logic
  const startIdx = (page - 1) * INVITES_PER_PAGE;
  const pagedInvites = invites.slice(startIdx, startIdx + INVITES_PER_PAGE);

  return (
    <div className="invite-manager-panel">
      <h2 className="invite-manager-title">Manage Sent Invites</h2>
      <div className="invite-manager-list-grid">
        {invites.length === 0 && (
          <div className="invite-manager-fallback">No invites to manage.</div>
        )}
        {pagedInvites.map((invite) => (
          <div className="invite-manager-card" key={invite.id}>
            <div className="invite-manager-info">
              <span className="invite-manager-user">{invite.user}</span>
              <span className={`invite-manager-status ${getStatusClass(invite.status)}`}>{invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}</span>
              <span className="invite-manager-date">{invite.date}</span>
            </div>
            <div className="invite-manager-actions">
              {invite.status === 'pending' && (
                <button className="btn resend-btn" onClick={handleResend}>Resend</button>
              )}
              <button className="btn cancel-btn" onClick={() => handleCancel(invite.id)}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="invite-manager-pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default InviteManager; 