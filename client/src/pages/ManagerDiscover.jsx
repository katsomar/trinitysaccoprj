import React, { useState, useRef } from "react";
import "../styles/discover.css";

const mockGroups = [
  { id: "g1", name: "Education Fund", members: 24 },
  { id: "g2", name: "Business Group", members: 15 },
  { id: "g3", name: "Holiday Club", members: 8 },
  { id: "g4", name: "Women Empowerment", members: 32 },
  { id: "g5", name: "Farmers SACCO", members: 19 },
];
const mockUsers = [
  { id: "u1", username: "jane_doe", name: "Jane Doe" },
  { id: "u2", username: "john_smith", name: "John Smith" },
  { id: "u3", username: "alice_j", name: "Alice Johnson" },
  { id: "u4", username: "bob_lee", name: "Bob Lee" },
  { id: "u5", username: "mary_ann", name: "Mary Ann" },
];
const managedGroups = [
  { id: "g1", name: "Education Fund" },
  { id: "g2", name: "Business Group" },
];

function ManagerDiscover() {
  const [searchType, setSearchType] = useState("group");
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [showTrending, setShowTrending] = useState(false);
  const [inviteStep, setInviteStep] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [invitePwd, setInvitePwd] = useState("");
  const [invitePwdError, setInvitePwdError] = useState("");
  const [inviteUsers, setInviteUsers] = useState([]);
  const [inviteSearch, setInviteSearch] = useState("");
  const [inviteResults, setInviteResults] = useState([]);
  const [inviteMsg, setInviteMsg] = useState("");
  const searchRef = useRef(null);

  // Handle search
  function handleSearch(e) {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setResults([]);
      return;
    }
    if (searchType === "group") {
      setResults(
        mockGroups.filter(g =>
          g.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setResults(
        mockUsers.filter(u =>
          u.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          u.username.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  }

  // Invite flow handlers
  function startInvite(user) {
    setInviteStep(1);
    setInviteUsers([user]);
    setSelectedGroup("");
    setInvitePwd("");
    setInvitePwdError("");
    setInviteSearch("");
    setInviteResults([]);
    setInviteMsg("");
  }
  function handleGroupSelect(e) {
    setSelectedGroup(e.target.value);
  }
  function handlePwdConfirm() {
    if (!invitePwd) {
      setInvitePwdError("Password required");
      return;
    }
    setInviteStep(3);
    setInvitePwdError("");
  }
  function handleInviteSearch(e) {
    setInviteSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setInviteResults([]);
      return;
    }
    setInviteResults(
      mockUsers.filter(
        u =>
          (u.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            u.username.toLowerCase().includes(e.target.value.toLowerCase())) &&
          !inviteUsers.some(sel => sel.id === u.id)
      )
    );
  }
  function handleAddInviteUser(user) {
    setInviteUsers(prev => [...prev, user]);
    setInviteResults(prev => prev.filter(u => u.id !== user.id));
    setInviteSearch("");
  }
  function handleRemoveInviteUser(user) {
    setInviteUsers(prev => prev.filter(u => u.id !== user.id));
  }
  function handleSendInvites() {
    setInviteStep(0);
    alert("Invitations sent!");
  }

  return (
    <div className="discover-root">
      {/* Top NavBar (copied from ManagerDashboard) */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="profile-viewer" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/profile'}>
            <img src="/assets/manager-avatar.png" alt="Avatar" className="avatar" />
            <span>Manager Jane</span>
          </div>
        </div>
        <div className="navbar-center">
          <div className="discover-searchbar-wrapper">
            <input
              type="text"
              className="search-bar"
              placeholder="Search groups or users..."
              value={search}
              onFocus={() => { setFocused(true); setShowTrending(true); }}
              onBlur={() => { setFocused(false); setTimeout(() => setShowTrending(false), 200); }}
              onChange={handleSearch}
            />
            <div className="discover-type-select-wrapper">
              <select
                id="discover-type-select"
                className="discover-type-select"
                value={searchType}
                onChange={e => { setSearchType(e.target.value); setSearch(""); setResults([]); }}
              >
                <option value="group">Groups</option>
                <option value="user">Users</option>
              </select>
            </div>
            <button className="discover-btn" onClick={() => window.location.href = "/manager-discover"}>Discover</button>
            {/* Dropdown for search results (groups or users) */}
            {(search.length > 0) && (
              <div className="discover-trending-dropdown">
                {searchType === "group"
                  ? (
                    <>
                      <div className="discover-trending-title">Trending Groups</div>
                      {results.length > 0 ? results.map(g => (
                        <div className="discover-trending-row" key={g.id}>
                          <span className="discover-group-name">{g.name}</span>
                          <span className="discover-group-members">{g.members} members</span>
                          <button className="discover-join-btn">Send Request to Join</button>
                        </div>
                      )) : <div className="discover-no-results">No groups found.</div>}
                    </>
                  )
                  : (
                    <>
                      <div className="discover-trending-title">Users</div>
                      {results.length > 0 ? results.map(u => (
                        <div className="discover-trending-row" key={u.id}>
                          <span className="discover-user-name">{u.name} <span className="discover-username">@{u.username}</span></span>
                          <div className="discover-user-actions">
                            <button className="discover-chat-btn" onClick={() => window.location.href = `/manager-chat/${u.username}`}>Chat</button>
                            <button className="discover-invite-btn" onClick={() => startInvite(u)}>Invite</button>
                          </div>
                        </div>
                      )) : <div className="discover-no-results">No users found.</div>}
                    </>
                  )}
              </div>
            )}
            {showTrending && searchType === "group" && search.trim() === "" && (
              <div className="discover-trending-dropdown">
                <div className="discover-trending-title">Trending Groups</div>
                {mockGroups.map(g => (
                  <div className="discover-trending-row" key={g.id}>
                    <span className="discover-group-name">{g.name}</span>
                    <span className="discover-group-members">{g.members} members</span>
                    <button className="discover-join-btn">Send Request to Join</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={() => window.location.href = "/login"}>Logout</button>
        </div>
      </nav>
      {/* Invite Modal Flow */}
      {inviteStep === 1 && (
        <div className="discover-modal-overlay">
          <div className="discover-modal">
            <h2>Select Group to Invite</h2>
            <select className="discover-modal-select" value={selectedGroup} onChange={handleGroupSelect}>
              <option value="">-- Select Group --</option>
              {managedGroups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <button className="btn" disabled={!selectedGroup} onClick={() => setInviteStep(2)}>Continue</button>
            <button className="btn" onClick={() => setInviteStep(0)} style={{marginLeft:8}}>Cancel</button>
          </div>
        </div>
      )}
      {inviteStep === 2 && (
        <div className="discover-modal-overlay">
          <div className="discover-modal">
            <h2>Password Verification</h2>
            <input
              type="password"
              className="discover-modal-input"
              placeholder="Enter your password"
              value={invitePwd}
              onChange={e => setInvitePwd(e.target.value)}
              autoFocus
            />
            {invitePwdError && <div className="discover-modal-error">{invitePwdError}</div>}
            <button className="btn" onClick={handlePwdConfirm}>Verify</button>
            <button className="btn" onClick={() => setInviteStep(0)} style={{marginLeft:8}}>Cancel</button>
          </div>
        </div>
      )}
      {inviteStep === 3 && (
        <div className="discover-modal-overlay">
          <div className="discover-modal" style={{maxWidth:500}}>
            <h2>Invite Users to {managedGroups.find(g => g.id === selectedGroup)?.name}</h2>
            <input
              className="discover-modal-input"
              type="text"
              placeholder="Search users by name or username..."
              value={inviteSearch}
              onChange={handleInviteSearch}
            />
            {inviteResults.length > 0 && (
              <ul className="discover-modal-search-results">
                {inviteResults.map(u => (
                  <li key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span>{u.name} (@{u.username})</span>
                    <button className="btn" style={{fontSize:'0.95rem',padding:'0.2rem 0.7rem'}} onClick={() => handleAddInviteUser(u)}>Add</button>
                  </li>
                ))}
              </ul>
            )}
            {inviteUsers.length > 0 && (
              <div className="discover-modal-selected-users" style={{margin:'0.7rem 0',display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {inviteUsers.map(u => (
                  <span key={u.id} className="discover-modal-user-tag">
                    {u.name} <button onClick={() => handleRemoveInviteUser(u)} style={{marginLeft:4,color:'#dc3545',background:'none',border:'none',cursor:'pointer',fontWeight:700}}>&times;</button>
                  </span>
                ))}
              </div>
            )}
            <textarea
              className="discover-modal-input"
              style={{width:'100%',minHeight:70,marginBottom:12}}
              placeholder="Custom invitation message..."
              value={inviteMsg}
              onChange={e => setInviteMsg(e.target.value)}
            />
            <button className="btn" style={{marginTop:8}} disabled={inviteUsers.length===0} onClick={handleSendInvites}>
              Send Invitations
            </button>
            <button className="btn" onClick={() => setInviteStep(0)} style={{marginLeft:8}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerDiscover;
