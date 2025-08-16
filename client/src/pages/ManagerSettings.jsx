import React, { useState } from "react";
import "../styles/manager-settings.css";
import { useNavigate } from "react-router-dom";
import ManagerTopNav from '../components/ManagerTopNav';


const user = {
  name: "Manager Jane",
  accountNumber: "MGR20250717001",
  avatar: "/assets/manager-avatar.png",
  online: true,
};

const paymentDefaults = {
  mtn: "0771234567",
  airtel: "0759876543",
  bank: "1234567890 (Equity Bank)",
  cash: "Kampala Main Branch",
};

const notificationDefaults = {
  deposit: true,
  withdrawal: true,
  newMember: true,
  system: false,
  whatsapp: "",
  email: true,
};

const ManagerSettings = () => {
  const navigate = useNavigate();
  // Security
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [online, setOnline] = useState(true);
  const [multiDevice, setMultiDevice] = useState(false);

  // Payment
  const [payment, setPayment] = useState(paymentDefaults);
  const [paymentMsg, setPaymentMsg] = useState("");

  // Notifications
  const [notif, setNotif] = useState(notificationDefaults);
  const [notifMsg, setNotifMsg] = useState("");

  // Interest
  const [interest, setInterest] = useState(7.5);
  const [frequency, setFrequency] = useState("Monthly");
  const [interestMsg, setInterestMsg] = useState("");

  // Membership
  const [autoApprove, setAutoApprove] = useState(false);
  const [maxMembers, setMaxMembers] = useState(50);
  const [memberMsg, setMemberMsg] = useState("");

  // Data tools
  const [dataMsg, setDataMsg] = useState("");

  // Handlers
  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("All fields required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    setPasswordMsg("Password updated! (simulated)");
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };
  const handlePaymentSave = (e) => {
    e.preventDefault();
    setPaymentMsg("Payment methods updated! (simulated)");
  };
  const handleNotifSave = (e) => {
    e.preventDefault();
    setNotifMsg("Notification preferences updated! (simulated)");
  };
  const handleInterestSave = (e) => {
    e.preventDefault();
    setInterestMsg("Interest settings updated! (simulated)");
  };
  const handleMemberSave = (e) => {
    e.preventDefault();
    setMemberMsg("Membership settings updated! (simulated)");
  };
  const handleExport = (type) => {
    setDataMsg(type + " exported! (simulated)");
    setTimeout(() => setDataMsg(""), 1500);
  };

  return (
    <div className="manager-settings-root">
      {/* Top NavBar */}
      <ManagerTopNav />
      <div className="manager-settings-main">
        <aside className="sidebar">
          <div className="online-status">
            <span className={`status-dot ${online ? "online" : "offline"}`}></span>
            <span>{online ? "Online" : "Offline"}</span>
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/members")}><span style={{ marginRight: '8px' }} role="img" aria-label="members">👥</span>Members</li>
            <li onClick={() => navigate("/manager-transactions")}><span style={{ marginRight: '8px' }} role="img" aria-label="transactions">💳</span>Transactions</li>
            <li onClick={() => navigate("/groups")}><span style={{ marginRight: '8px' }} role="img" aria-label="groups">🗂️</span>Groups</li>
            <li onClick={() => navigate("/interest-calculator")}><span style={{ marginRight: '8px' }} role="img" aria-label="calculator">🧮</span>Interest Calculator</li>
            <li onClick={() => navigate("/reports")}><span style={{ marginRight: '8px' }} role="img" aria-label="reports">📊</span>Reports</li>
            <li onClick={() => navigate("/manager-notifications")}><span style={{ marginRight: '8px' }} role="img" aria-label="notifications">🔔</span>Manager Notifications</li>
            <li onClick={() => navigate("/manager-chat")}><span style={{ marginRight: '8px' }} role="img" aria-label="chat">💬</span>Chat</li>
            <li className="active" onClick={() => navigate("/manager-settings")}><span style={{ marginRight: '8px' }} role="img" aria-label="settings">⚙️</span>Settings</li>
          </ul>
          <div className="sidebar-logo">
            <img src="/src/assets/images/logo.png" alt="Trinity SACCO" style={{ filter: "grayscale(100%)", opacity: 0.65 }}/>
            <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
          </div>
        </aside>
        
        <div className="manager-settings-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 className="settings-title">Settings</h1>
              <button
                className="btn tx-back-btn"
                style={{
                  background: "#e3e6ee",
                  color: "#004080",
                  fontWeight: 500,
                  borderRadius: "8px",
                  padding: "0.5rem 1.2rem",
                  fontSize: "1rem",
                  marginLeft: "auto"
                }}
                onClick={() => navigate("/manager-dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          

          {/* 1. Security Settings */}
          <section className="settings-section">
            <h2>Security Settings</h2>
            <form className="settings-form" onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label>Old Password</label>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button className="btn save-btn" type="submit">Reset Password</button>
              {passwordMsg && <div className="form-msg">{passwordMsg}</div>}
            </form>
            <div className="settings-row">
              <label>Online Status:</label>
              <button className={`status-toggle ${online ? "on" : "off"}`} onClick={() => setOnline(o => !o)}>
                <span className={`status-dot ${online ? "online" : "offline"}`}></span> {online ? "Online" : "Offline"}
              </button>
            </div>
            <div className="settings-row">
              <label>Login on Multiple Devices:</label>
              <input type="checkbox" checked={multiDevice} onChange={e => setMultiDevice(e.target.checked)} />
              <span style={{ marginLeft: 10, color: "#888" }}>(QR code coming soon)</span>
            </div>
          </section>

          {/* 2. Payment Methods */}
          <section className="settings-section">
            <h2>Payment Methods</h2>
            <form className="settings-form" onSubmit={handlePaymentSave}>
              <div className="form-group">
                <label>MTN Number</label>
                <input type="text" value={payment.mtn} onChange={e => setPayment(p => ({ ...p, mtn: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Airtel Number</label>
                <input type="text" value={payment.airtel} onChange={e => setPayment(p => ({ ...p, airtel: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Bank Account</label>
                <input type="text" value={payment.bank} onChange={e => setPayment(p => ({ ...p, bank: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Cash Location</label>
                <input type="text" value={payment.cash} onChange={e => setPayment(p => ({ ...p, cash: e.target.value }))} />
              </div>
              <button className="btn save-btn" type="submit">Save Changes</button>
              {paymentMsg && <div className="form-msg">{paymentMsg}</div>}
            </form>
          </section>

          {/* 3. Notification Preferences */}
          <section className="settings-section">
            <h2>Notification Preferences</h2>
            <form className="settings-form" onSubmit={handleNotifSave}>
              <div className="form-group toggles">
                <label>
                  <input type="checkbox" checked={notif.deposit} onChange={e => setNotif(n => ({ ...n, deposit: e.target.checked }))} /> Deposit Alerts
                </label>
                <label>
                  <input type="checkbox" checked={notif.withdrawal} onChange={e => setNotif(n => ({ ...n, withdrawal: e.target.checked }))} /> Withdrawal Requests
                </label>
                <label>
                  <input type="checkbox" checked={notif.newMember} onChange={e => setNotif(n => ({ ...n, newMember: e.target.checked }))} /> New Member Joins
                </label>
                <label>
                  <input type="checkbox" checked={notif.system} onChange={e => setNotif(n => ({ ...n, system: e.target.checked }))} /> System Announcements
                </label>
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input type="text" value={notif.whatsapp} onChange={e => setNotif(n => ({ ...n, whatsapp: e.target.value }))} placeholder="e.g. 0771234567" />
              </div>
              <div className="form-group">
                <label>Email Notifications</label>
                <input type="checkbox" checked={notif.email} onChange={e => setNotif(n => ({ ...n, email: e.target.checked }))} />
              </div>
              <button className="btn save-btn" type="submit">Save Preferences</button>
              {notifMsg && <div className="form-msg">{notifMsg}</div>}
            </form>
          </section>

          {/* 4. Group Interest Control */}
          <section className="settings-section">
            <h2>Group Interest Control</h2>
            <form className="settings-form" onSubmit={handleInterestSave}>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" min="0" max="100" step="0.01" value={interest} onChange={e => setInterest(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Interest Frequency</label>
                <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <button className="btn save-btn" type="submit">Apply Changes</button>
              {interestMsg && <div className="form-msg">{interestMsg}</div>}
            </form>
          </section>

          {/* 5. Membership Settings */}
          <section className="settings-section">
            <h2>Membership Settings</h2>
            <form className="settings-form" onSubmit={handleMemberSave}>
              <div className="form-group">
                <label>Auto-approve Join Requests</label>
                <input type="checkbox" checked={autoApprove} onChange={e => setAutoApprove(e.target.checked)} />
              </div>
              <div className="form-group">
                <label>Max Members</label>
                <input type="number" min="1" max="500" value={maxMembers} onChange={e => setMaxMembers(e.target.value)} />
              </div>
              <button className="btn save-btn" type="submit">Save Membership Settings</button>
              {memberMsg && <div className="form-msg">{memberMsg}</div>}
            </form>
          </section>

          {/* 6. Data Tools */}
          <section className="settings-section">
            <h2>Data Tools</h2>
            <div className="data-tools-row">
              <button className="btn export-btn" onClick={() => handleExport("PDF Report")}>Export Transactions (PDF)</button>
              <button className="btn export-btn" onClick={() => handleExport("Excel Report")}>Export Transactions (Excel)</button>
              <button className="btn export-btn" onClick={() => handleExport("Group Summary")}>Download Group Summary</button>
            </div>
            {dataMsg && <div className="form-msg">{dataMsg}</div>}
          </section>
          <div className="settings-actions">
              <button className="settings-undo-btn btn" onClick={() => alert("Undone!")}>
                Undo
              </button>
              <button className="settings-redo-btn btn" onClick={() => alert("Redone!")}>
                Redo
              </button>
              <button
                className="settings-save-btn btn"
                onClick={() => alert("Changes saved!")}
                type="button"
              >
                Save Changes
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings; 