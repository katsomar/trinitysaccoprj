import React, { useState } from "react";
import "../styles/notifications.css";
// Remove NavBar import, use custom navbar below
import { useNavigate } from "react-router-dom";
import DepositModal from '../components/DepositModal';
import WithdrawPopup from '../components/WithdrawPopup';
import SaverTopNav from "../components/SaverTopNav";

const user = {
  name: "Kats Omar",
  accountNumber: "SACCO20250717001",
  avatar: "/assets/avatar.png",
  online: true,
};

const dummyNotifications = [
  {
    id: 1,
    type: "group_invite",
    message:
      "You have been invited to join the Project Alpha group. Click to see more.",
    details:
      "John Doe has invited you to join the Project Alpha group. Accept to join and collaborate with the team.",
    read: false,
  },
  {
    id: 2,
    type: "friend_request",
    message: "Jane Smith sent you a friend request.",
    details:
      "Jane Smith wants to add you as a friend. Accept to connect or ignore to dismiss.",
    read: false,
  },
  {
    id: 3,
    type: "message",
    message: "New message from Alex: 'Hey, are you available for a call?'",
    details:
      "Alex: Hey, are you available for a call later today? Let me know what time works for you!",
    read: false,
  },
  {
    id: 4,
    type: "group_update",
    message: "Project Beta group has a new update.",
    details:
      "The Project Beta group has posted a new update regarding the upcoming deadline. Please review the changes.",
    read: false,
  },
];

const typeActions = {
  group_invite: [
    { label: "Accept", action: "accept" },
    { label: "Decline", action: "decline" },
  ],
  friend_request: [
    { label: "Accept Friend", action: "accept_friend" },
    { label: "Ignore", action: "ignore" },
  ],
  message: [
    { label: "Mark as Read", action: "mark_read" },
    { label: "Reply", action: "reply" },
  ],
  group_update: [{ label: "Mark as Read", action: "mark_read" }],
};

const Notifications = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const navigate = useNavigate();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAction = (notifId, action) => {
    // Dummy action handler
    if (action === "mark_read") {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } else {
      // For demo, just close the expanded card
      setExpandedId(null);
    }
  };

  return (
    <div className="notifications-root">
      {/* Navbar */}
      <SaverTopNav />
      <div className="notifications-main">
        <aside className="sidebar">
          <div className="online-status">
            <span
              className={`status-dot ${user.online ? "online" : "offline"}`}
            ></span>
            <span>{user.online ? "Online" : "Offline"}</span>
          </div>
          <ul className="sidebar-menu">
          <li className={location.pathname === "/deposit" ? "active" : ""} onClick={() => setShowDepositModal(true)}>Deposit</li>
          <li className={location.pathname === "/withdraw" ? "active" : ""} onClick={() => setShowWithdrawModal(true)}>Withdraw</li>
            <li onClick={() => navigate("/notifications")}>Notifications</li>
            <li onClick={() => navigate("/chat")}>Chat</li>
            <li onClick={() => navigate("/settings")}>Settings</li>
          </ul>
          <div className="sidebar-logo">
            <img
              src="/src/assets/images/logo.png"
              alt="Trinity SACCO"
              style={{ filter: "grayscale(100%)", opacity: 0.65 }}
            />
            <div className="sidebar-logo-text">
              Powered by Omblo Technologies
            </div>
          </div>
        </aside>
        <div className="notifications-container">
          <div className="notifications-header-row">
            <div className="notifications-title">Notifications</div>
            <button className="back-dashboard-btn">Back to Dashboard</button>
          </div>
          <div className="notifications-list">
            {notifications.map((notif) => {
              const isExpanded = expandedId === notif.id;
              return (
                <div
                  key={notif.id}
                  className={`notification-card${
                    isExpanded ? " expanded" : ""
                  }${notif.read ? " read" : ""}`}
                  onClick={() => handleExpand(notif.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleExpand(notif.id);
                  }}
                >
                  <div className="notification-preview">{notif.message}</div>
                  <div className="notification-details-wrapper">
                    <div className="notification-details">{notif.details}</div>
                    {isExpanded && (
                      <div className="notification-actions">
                        {typeActions[notif.type].map((btn) => (
                          <button
                            key={btn.action}
                            className="notification-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notif.id, btn.action);
                            }}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
    <WithdrawPopup isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
    </div>
    
  );
};

export default Notifications;
