import React, { useState, useRef, useEffect } from "react";
import "../styles/chat.css";

// Dummy data for contacts/groups
const contacts = [
  {
    id: 1,
    name: "Mary W.",
    lastMessage: "See you at the meeting!",
    online: true,
    profile: "https://ui-avatars.com/api/?name=Mary+W",
    messages: [
      { id: 1, text: "Hi Mary!", sent: true, time: "09:00" },
      { id: 2, text: "See you at the meeting!", sent: false, time: "09:01" },
    ],
  },
  {
    id: 2,
    name: "Sacco Group",
    lastMessage: "Let's save more this month.",
    online: false,
    profile: "https://ui-avatars.com/api/?name=Sacco+Group",
    messages: [
      { id: 1, text: "Let's save more this month.", sent: false, time: "08:45" },
    ],
  },
  {
    id: 3,
    name: "John K.",
    lastMessage: "No messages yet.",
    online: true,
    profile: "https://ui-avatars.com/api/?name=John+K",
    messages: [],
  },
  // ...add more as needed
];

// Dummy user for navbar
const user = {
  name: "Mary W.",
  avatar: "https://ui-avatars.com/api/?name=Mary+W"
};

function ManagerChat() {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState("");
  const [contactList, setContactList] = useState(contacts);
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  // Handle sending a message (dummy)
  const handleSend = () => {
    if (!input.trim() || selected === null) return;
    const updatedContacts = contactList.map((c, idx) => {
      if (idx === selected) {
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: Date.now(),
              text: input,
              sent: true,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
          lastMessage: input,
        };
      }
      return c;
    });
    setContactList(updatedContacts);
    setInput("");
  };

  // Handle Enter key
  const handleInputKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Top nav bar styled exactly like SaverDashboard
  const TopNav = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="profile-viewer" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/profile'}>
          <img src={user.avatar} alt="Avatar" className="avatar" />
          <span>{user.name}</span>
        </div>
      </div>
      <div className="navbar-center">
        <input
          type="text"
          className="search-bar"
          placeholder="Search groups or friends..."
          // Optionally add onChange handler if needed
        />
        <button className="discover-btn" onClick={() => navigate("/manager-discover")}>Discover
        </button>
      </div>
      <div className="navbar-right">
        <button className="logout-btn" onClick={() => window.location.href = "/login"}>
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <div className="chat-root">
      <TopNav />
      <div className="chat-main">
        {/* LEFT SIDEBAR */}
        <aside className="chat-sidebar" style={{ marginTop: 0, top: 0, height: "100%" }}>
          <div className="chat-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="chat-back-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: '8px', display: 'flex', alignItems: 'center' }}
              title="Back to Dashboard"
              onClick={() => window.location.href = "/manager-dashboard"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#004080" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            CHAT SPACE
          </div>
          <div className="chat-contacts-list">
            {contactList.map((c, idx) => (
              <div
                key={c.id}
                className={`chat-contact-item${selected === idx ? " selected" : ""}`}
                onClick={() => setSelected(idx)}
              >
                <img src={c.profile} alt={c.name} className="chat-contact-avatar" />
                <div className="chat-contact-info">
                  <div className="chat-contact-name">
                    {c.name}
                    <span
                      className={`chat-status-dot ${c.online ? "online" : "offline"}`}
                      title={c.online ? "Online" : "Offline"}
                    />
                  </div>
                  <div className="chat-contact-last">{c.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="sidebar-logo">
            <img
              src="/src/assets/images/logo.png"
              alt="Trinity SACCO"
              style={{ filter: "grayscale(100%)", opacity: 0.65 }}
            />
            <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
          </div>
        </aside>
        {/* RIGHT MAIN CHAT AREA */}
        <section className="chat-area">
          {selected === null ? (
            <div className="chat-empty-state">
              Begin chatting with your fellow savers or groups
            </div>
          ) : (
            <div className="chat-area-content">
              {/* Chat header */}
              <div className="chat-area-header">
                <img
                  src={contactList[selected].profile}
                  alt={contactList[selected].name}
                  className="chat-area-avatar"
                />
                <div>
                  <div className="chat-area-name">{contactList[selected].name}</div>
                  <div className="chat-area-status">
                    {contactList[selected].online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div className="chat-messages-list">
                {contactList[selected].messages.length === 0 ? (
                  <div className="chat-no-messages">No messages yet.</div>
                ) : (
                  contactList[selected].messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message-bubble${msg.sent ? " sent" : " received"}`}
                    >
                      <span className="chat-message-text">{msg.text}</span>
                      <span className="chat-message-time">{msg.time}</span>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Input area */}
              <div className="chat-input-row">
                <button className="chat-voice-btn" title="Voice Call">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    {/* ...simple phone icon... */}
                    <path d="M3 2l3 3c.5.5.5 1.3 0 1.8l-1 1c1.7 3.2 4.2 5.7 7.4 7.4l1-1c.5-.5 1.3-.5 1.8 0l3 3c.5.5.5 1.3 0 1.8l-1.2 1.2c-.7.7-1.8.9-2.7.5C7.7 17.2 2.8 12.3 1.2 6.9c-.4-.9-.2-2 .5-2.7L2.9 3c.5-.5 1.3-.5 1.8 0z" fill="#888"/>
                  </svg>
                </button>
                <input
                  className="chat-input"
                  type="text"
                  placeholder="Type a message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKey}
                  disabled={selected === null}
                />
                <button className="chat-send-btn" onClick={handleSend} disabled={selected === null || !input.trim()}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    {/* ...simple send icon... */}
                    <polygon points="2,17 18,10 2,3 5,10" fill="#fff"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
      <footer className="footer">
        <span>&copy; 2024 Trinity SACCO. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default ManagerChat;
