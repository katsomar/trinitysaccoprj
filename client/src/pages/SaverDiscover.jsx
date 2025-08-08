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

function SaverDiscover() {
  const [searchType, setSearchType] = useState("group");
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [showTrending, setShowTrending] = useState(false);
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

  return (
    <div className="discover-root">
      {/* Top NavBar */}
      <nav className="navbar discover-navbar">
        <div className="navbar-left">
          <span className="discover-title">Discover</span>
        </div>
        <div className="navbar-center">
          <div className="discover-searchbar-wrapper">
            <input
              ref={searchRef}
              type="text"
              className="discover-searchbar"
              placeholder={searchType === "group" ? "Search groups..." : "Search users..."}
              value={search}
              onFocus={() => { setFocused(true); setShowTrending(true); }}
              onBlur={() => { setFocused(false); setTimeout(() => setShowTrending(false), 200); }}
              onChange={handleSearch}
            />
            <select
              className="discover-type-select"
              value={searchType}
              onChange={e => { setSearchType(e.target.value); setSearch(""); setResults([]); }}
            >
              <option value="group">Groups</option>
              <option value="user">Users</option>
            </select>
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
      </nav>
      <div className="discover-results-container">
        {results.length > 0 && (
          <div className="discover-results-list">
            {searchType === "group"
              ? results.map(g => (
                  <div className="discover-result-row" key={g.id}>
                    <span className="discover-group-name">{g.name}</span>
                    <span className="discover-group-members">{g.members} members</span>
                    <button className="discover-join-btn">Send Request to Join</button>
                  </div>
                ))
              : results.map(u => (
                  <div className="discover-result-row" key={u.id}>
                    <span className="discover-user-name">{u.name} <span className="discover-username">@{u.username}</span></span>
                    <button className="discover-chat-btn" onClick={() => window.location.href = `/chat/${u.username}`}>Chat</button>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SaverDiscover;
