import React, { useState } from "react";
import "../styles/manager-notifications.css";
import { useNavigate } from "react-router-dom";
import ManagerTopNav from '../components/ManagerTopNav';

const user = {
  name: "Manager Jane",
  accountNumber: "MGR20250717001",
  avatar: "/assets/manager-avatar.png",
  online: true,
};

const dummyNotifications = [
  {
    id: 1,
    type: "withdraw_request",
    message: "John Doe requested to withdraw $500",
    details: "John Doe (SACCO20250717002) has requested to withdraw $500 from the School Savers group. Please review and approve or decline the request.",
    read: false,
  },
  {
    id: 2,
    type: "new_member_joined",
    message: "Alice Smith joined your group",
    details: "Alice Smith has joined your group 'Family Fund'. You can send a welcome message or view her profile.",
    read: false,
  },
  {
    id: 3,
    type: "group_invite_accepted",
    message: "Bob Lee accepted the invite to join group Holiday Club",
    details: "Bob Lee has accepted your invitation to join the group 'Holiday Club'. You may message Bob or close this notification.",
    read: false,
  },
  {
    id: 4,
    type: "contribution_received",
    message: "New contribution of $200 received from Carol",
    details: "Carol (SACCO20250717005) has contributed $200 to the Project Alpha group. You can send a receipt or close this notification.",
    read: false,
  },
  {
    id: 5,
    type: "interest_change_alert",
    message: "Interest rate updated for group Project Beta",
    details: "The interest rate for the group 'Project Beta' has been updated to 7.5%. You may acknowledge or edit the interest settings.",
    read: false,
  },
];

const typeActions = {
  withdraw_request: [
    { label: "Approve", action: "approve" },
    { label: "Decline", action: "decline" },
    { label: "View Details", action: "view_details" },
  ],
  new_member_joined: [
    { label: "Send Welcome", action: "send_welcome" },
    { label: "View Profile", action: "view_profile" },
  ],
  group_invite_accepted: [
    { label: "Message User", action: "message_user" },
    { label: "Close", action: "close" },
  ],
  contribution_received: [
    { label: "Send Receipt", action: "send_receipt" },
    { label: "Close", action: "close" },
  ],
  interest_change_alert: [
    { label: "Acknowledge", action: "acknowledge" },
    { label: "Edit Interest", action: "edit_interest" },
  ],
};

const ManagerNotifications = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const navigate = useNavigate();

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAction = (notifId, action) => {
    // Dummy action handler
    if (action === "close" || action === "acknowledge") {
      setExpandedId(null);
      setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
    }
    // Add more logic as needed for demo
  };

  return (
    <div className="manager-notifications-root">
      {/* Top NavBar */}
      <ManagerTopNav />
      <div className="manager-notifications-main">
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
            <li onClick={() => navigate("/manager-chat")}>Chat</li>
            <li className="active" onClick={() => navigate("/manager-settings")}>Settings</li>
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
        <div className="manager-notifications-container">
          <div className="manager-notifications-header-row">
            <div className="manager-notifications-title">Manager Notifications</div>
            <button className="back-dashboard-btn" onClick={() => navigate("/manager-dashboard")}>Back to Dashboard</button>
          </div>
          <div className="manager-notifications-list">
            {notifications.map((notif) => {
              const isExpanded = expandedId === notif.id;
              return (
                <div
                  key={notif.id}
                  className={`manager-notification-card${isExpanded ? " expanded" : ""}${notif.read ? " read" : ""}`}
                  onClick={() => handleExpand(notif.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleExpand(notif.id);
                  }}
                >
                  <div className="manager-notification-preview">{notif.message}</div>
                  <div className="manager-notification-details-wrapper">
                    <div className="manager-notification-details">{notif.details}</div>
                    {isExpanded && (
                      <div className="manager-notification-actions">
                        {typeActions[notif.type].map((btn) => (
                          <button
                            key={btn.action}
                            className="manager-notification-action-btn"
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
    </div>
  );
};

export default ManagerNotifications; 