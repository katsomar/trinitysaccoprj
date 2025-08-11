import React, { useState } from "react";
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

export default function SaverTopNav() {
  const [searchType, setSearchType] = useState("group");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showTrending, setShowTrending] = useState(false);
  const [focused, setFocused] = useState(false);

  const displayName = localStorage.getItem("userName") || "Saver User";
  const avatar = "/assets/avatar.png";

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

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="profile-viewer" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/profile'}>
          <img src={avatar} alt="Avatar" className="avatar" />
          <span>{displayName}</span>
        </div>
      </div>
      <div className="navbar-center">
        <div className="discover-searchbar-wrapper">
          <span className="search-icon" aria-hidden="true" style={{ marginRight: 8 }}>🔍</span>
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
              <option value="group">🗂️ Groups</option>
              <option value="user">👥 Users</option>
            </select>
          </div>
          <button className="discover-btn" onClick={() => window.location.href = "/discover"}>Discover</button>
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
                          <button className="discover-chat-btn" onClick={() => window.location.href = `/chat`}>Chat</button>
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
        <button className="logout-btn" onClick={() => window.location.href = "/login"}>🚪 Logout</button>
      </div>
    </nav>
  );
}
