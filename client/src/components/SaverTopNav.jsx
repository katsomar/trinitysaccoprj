import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop search state (existing)
  const [searchType, setSearchType] = useState("group");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showTrending, setShowTrending] = useState(false);
  const [focused, setFocused] = useState(false);

  // Mobile menu/search state (new)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchType, setMobileSearchType] = useState("group");
  const [mobileSearch, setMobileSearch] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileShowTrending, setMobileShowTrending] = useState(false);

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
        mockGroups.filter((g) => g.name.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    } else {
      setResults(
        mockUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            u.username.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  }

  function handleMobileSearch(e) {
    const val = e.target.value;
    setMobileSearch(val);
    if (val.trim() === "") {
      setMobileResults([]);
      return;
    }
    if (mobileSearchType === "group") {
      setMobileResults(mockGroups.filter((g) => g.name.toLowerCase().includes(val.toLowerCase())));
    } else {
      setMobileResults(
        mockUsers.filter(
          (u) => u.name.toLowerCase().includes(val.toLowerCase()) || u.username.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
  }

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  // Avoid duplicate hamburger on the dashboard page where page-level menu already exists
  const isDashboard = location.pathname.startsWith("/saver-dashboard");

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div
            className="profile-viewer"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          />
          <div className="profile-viewer" style={{ cursor: "pointer" }} onClick={() => navigate("/profile") }>
            <img src={avatar} alt="Avatar" className="avatar" />
            <span>{displayName}</span>
          </div>
        </div>
        <div className="navbar-center">
          <div className="discover-searchbar-wrapper">
            <span className="search-icon" aria-hidden="true" style={{ marginRight: 8 }}>
              🔍
            </span>
            <input
              type="text"
              className="search-bar"
              placeholder="Search groups or users..."
              value={search}
              onFocus={() => {
                setFocused(true);
                setShowTrending(true);
              }}
              onBlur={() => {
                setFocused(false);
                setTimeout(() => setShowTrending(false), 200);
              }}
              onChange={handleSearch}
            />
            <div className="discover-type-select-wrapper">
              <select
                id="discover-type-select"
                className="discover-type-select"
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearch("");
                  setResults([]);
                }}
              >
                <option value="group">🗂️ Groups</option>
                <option value="user">👥 Users</option>
              </select>
            </div>
            <button className="discover-btn" onClick={() => navigate("/discover")}>Discover</button>
            {search.length > 0 && (
              <div className="discover-trending-dropdown">
                {searchType === "group" ? (
                  <>
                    <div className="discover-trending-title">Trending Groups</div>
                    {results.length > 0 ? (
                      results.map((g) => (
                        <div className="discover-trending-row" key={g.id}>
                          <span className="discover-group-name">{g.name}</span>
                          <span className="discover-group-members">{g.members} members</span>
                          <button className="discover-join-btn">Send Request to Join</button>
                        </div>
                      ))
                    ) : (
                      <div className="discover-no-results">No groups found.</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="discover-trending-title">Users</div>
                    {results.length > 0 ? (
                      results.map((u) => (
                        <div className="discover-trending-row" key={u.id}>
                          <span className="discover-user-name">
                            {u.name} <span className="discover-username">@{u.username}</span>
                          </span>
                          <div className="discover-user-actions">
                            <button className="discover-chat-btn" onClick={() => navigate(`/chat`)}>
                              Chat
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="discover-no-results">No users found.</div>
                    )}
                  </>
                )}
              </div>
            )}
            {showTrending && searchType === "group" && search.trim() === "" && (
              <div className="discover-trending-dropdown">
                <div className="discover-trending-title">Trending Groups</div>
                {mockGroups.map((g) => (
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
          <button className="logout-btn" onClick={() => (window.location.href = "/login")}>🚪 Logout</button>
        </div>
      </nav>

      {/* Hamburger and mobile side menu - hidden on dashboard page to avoid duplication */}
      {!isDashboard && (
        <>
          <button
            className={`hamburger-toggle ${mobileMenuOpen ? "active" : ""}`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="saver-mobile-side-menu"
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          {mobileMenuOpen && (
            <div className="mobile-menu-backdrop" onClick={closeMobileMenu} aria-hidden="true"></div>
          )}
          <nav
            id="saver-mobile-side-menu"
            className={`mobile-side-menu ${mobileMenuOpen ? "open" : ""}`}
            role="dialog"
            aria-modal="false"
            aria-label="Mobile Navigation"
          >
            {/* Online/Offline */}
            <div className="mobile-menu-section online-status">
              <span className={`status-dot online`}></span>
              <span>Online</span>
            </div>

            {/* Search + Type selector */}
            <div className="mobile-menu-section mobile-search">
              <label className="mobile-label" htmlFor="saver-mobile-search">Search</label>
              <div className="mobile-searchbar-wrapper">
                <div className="mobile-type-select-wrapper">
                  <select
                    className="mobile-type-select"
                    value={mobileSearchType}
                    onChange={(e) => {
                      setMobileSearchType(e.target.value);
                      setMobileSearch("");
                      setMobileResults([]);
                    }}
                  >
                    <option value="group">🗂️ Groups</option>
                    <option value="user">👥 Users</option>
                  </select>
                </div>
                <span className="mobile-search-icon" aria-hidden="true">
                  🔍
                </span>
                <input
                  id="saver-mobile-search"
                  type="text"
                  placeholder={`Search ${mobileSearchType === "group" ? "groups" : "users"}...`}
                  aria-label="Search"
                  value={mobileSearch}
                  onChange={handleMobileSearch}
                  onFocus={() => setMobileShowTrending(true)}
                  onBlur={() => setTimeout(() => setMobileShowTrending(false), 180)}
                />
              </div>
              {mobileSearch.length > 0 && (
                <div className="mobile-search-dropdown">
                  {mobileSearchType === "group" ? (
                    mobileResults.length > 0 ? (
                      mobileResults.map((g) => (
                        <div className="mobile-search-row" key={g.id}>
                          <span className="mobile-result-name">{g.name}</span>
                          <span className="mobile-result-meta">{g.members ?? "—"} members</span>
                          <button className="discover-join-btn" onClick={() => alert("Request to join sent")}>Request</button>
                        </div>
                      ))
                    ) : (
                      <div className="mobile-search-empty">No groups found.</div>
                    )
                  ) : mobileResults.length > 0 ? (
                    mobileResults.map((u) => (
                      <div className="mobile-search-row" key={u.id}>
                        <span className="mobile-result-name">
                          {u.name} <span className="mobile-result-meta">@{u.username}</span>
                        </span>
                        <div className="mobile-result-actions">
                          <button className="discover-chat-btn" onClick={() => { closeMobileMenu(); navigate("/chat"); }}>Chat</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mobile-search-empty">No users found.</div>
                  )}
                </div>
              )}
              {mobileShowTrending && mobileSearchType === "group" && mobileSearch.trim() === "" && (
                <div className="mobile-search-dropdown">
                  <div className="mobile-search-title">Trending Groups</div>
                  {mockGroups.map((g) => (
                    <div className="mobile-search-row" key={g.id}>
                      <span className="mobile-result-name">{g.name}</span>
                      <span className="mobile-result-meta">{g.members} members</span>
                      <button className="discover-join-btn" onClick={() => alert("Request to join sent")}>Request</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discover link */}
            <div className="mobile-menu-section mobile-discover-link">
              <button className="discover-btn" onClick={() => { closeMobileMenu(); navigate("/discover"); }}>Discover</button>
            </div>

            {/* Nav Links */}
            <ul className="mobile-nav-links">
              <li onClick={() => { closeMobileMenu(); navigate("/saver-dashboard"); }}>
                <span style={{ marginRight: "8px" }} role="img" aria-label="deposit">💰</span>Deposit
              </li>
              <li onClick={() => { closeMobileMenu(); navigate("/saver-dashboard"); }}>
                <span style={{ marginRight: "8px" }} role="img" aria-label="withdraw">💸</span>Withdraw
              </li>
              <li onClick={() => { closeMobileMenu(); navigate("/notifications"); }}>
                <span style={{ marginRight: "8px" }} role="img" aria-label="notifications">🔔</span>Notifications
              </li>
              <li onClick={() => { closeMobileMenu(); navigate("/chat"); }}>
                <span style={{ marginRight: "8px" }} role="img" aria-label="chat">💬</span>Chat
              </li>
              <li onClick={() => { closeMobileMenu(); navigate("/invites"); }}>
                <span style={{ marginRight: "8px" }} role="img" aria-label="invites">📩</span>Invites/Requests
              </li>
              <li onClick={() => { closeMobileMenu(); navigate("/settings"); }}>
                <span style={{ marginRight: "8px" }} role="img" aria-label="settings">⚙️</span>Settings
              </li>
              <li onClick={() => { closeMobileMenu(); (window.location.href = "/login"); }}>
                <span style={{ marginRight: "8px" }} role="img" aria-label="logout">🚪</span>Logout
              </li>
            </ul>

            {/* Footer logo */}
            <div className="mobile-menu-footer">
              <img src="/src/assets/images/logo.png" alt="Trinity SACCO" />
              <div className="sidebar-logo-text">Powered by Omblo Technologies</div>
            </div>
          </nav>
        </>
      )}

      {/* Mobile styles & overrides to ensure consistency across pages */}
      <style>{`
        :root { --nav-h: 56px; }
        /* Keep navbar profile aligned left on small devices */
        @media (max-width: 600px) {
          .navbar { flex-direction: row; justify-content: flex-start; align-items: center; padding-left: 12px; }
          .navbar-left { margin-right: auto; }
        }
        /* Hide center search and top-right logout on tablet/phone; use side menu instead */
        @media (max-width: 1024px) {
          .navbar .navbar-center { display: none; }
          .navbar .logout-btn { display: none !important; }
        }
        /* Hamburger toggle */
        .hamburger-toggle {
          position: fixed;
          top: 10px;
          right: 14px;
          width: 42px; height: 42px; border-radius: 10px; border: none;
          background: rgba(255,255,255,0.12);
          display: none; align-items: center; justify-content: center;
          z-index: 1001; cursor: pointer; transition: background 0.2s ease;
        }
        .hamburger-toggle:hover { background: rgba(255,255,255,0.2); }
        .hamburger-toggle span { position: absolute; width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: transform 0.28s ease, opacity 0.2s ease, top 0.28s ease; left: 10px; }
        .hamburger-toggle span:nth-child(1) { top: 14px; }
        .hamburger-toggle span:nth-child(2) { top: 20px; }
        .hamburger-toggle span:nth-child(3) { top: 26px; }
        .hamburger-toggle.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hamburger-toggle.active span:nth-child(2) { opacity: 0; }
        .hamburger-toggle.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        @media (max-width: 1024px) { .hamburger-toggle { display: inline-flex; } }

        /* Status dot (for when SaverDashboard.css isn't loaded) */
        .status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .status-dot.online { background: #28a745; }
        .status-dot.offline { background: #dc3545; }

        /* Mobile side menu */
        .mobile-side-menu { position: fixed; top: var(--nav-h); left: 0; width: min(84vw, 340px); height: calc(100vh - var(--nav-h));
          background: rgba(255,255,255,0.72); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          border-right: 1px solid rgba(0,0,0,0.06); box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transform: translateX(-102%); transition: transform 0.32s ease; z-index: 1000; padding: 1rem 1rem 1.2rem 1rem; overflow-y: auto; }
        .mobile-side-menu.open { transform: translateX(0); }
        .mobile-menu-section { margin-bottom: 1rem; }
        .mobile-label { display: block; font-weight: 600; color: #004080; margin-bottom: 6px; }
        .mobile-searchbar-wrapper { position: relative; display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.95); border: 1px solid #e3e6ee; border-radius: 10px; padding: 0.45rem 0.6rem; }
        .mobile-searchbar-wrapper input { border: none; outline: none; width: 100%; background: transparent; font-size: 1rem; color: #0f172a; }
        .mobile-type-select-wrapper { border-right: 1px solid #e3e6ee; padding-right: 6px; margin-right: 6px; }
        .mobile-type-select { border: none; background: transparent; font-weight: 600; color: #004080; }
        .mobile-search-dropdown { margin-top: 8px; background: rgba(255,255,255,0.98); border: 1px solid #e3e6ee; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
        .mobile-search-title { font-weight: 700; color: #004080; padding: 10px 12px; border-bottom: 1px solid #eef2f7; }
        .mobile-search-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .mobile-search-row:last-child { border-bottom: none; }
        .mobile-result-name { font-weight: 600; color: #0f172a; }
        .mobile-result-meta { color: #64748b; font-size: 0.92rem; margin-left: 8px; }
        .mobile-search-empty { padding: 12px; color: #64748b; }
        .discover-join-btn, .discover-chat-btn { border: none; border-radius: 8px; background: #007bff; color: #fff; padding: 6px 10px; cursor: pointer; }

        .mobile-nav-links { list-style: none; padding: 0; margin: 0.5rem 0 1rem 0; }
        .mobile-nav-links li { padding: 0.7rem 0.8rem; margin-bottom: 0.5rem; border-radius: 10px; background: rgba(255,255,255,0.9); border: 1px solid #e3e6ee; color: #004080; font-weight: 600; cursor: pointer; transition: background 0.2s ease; }
        .mobile-nav-links li:hover { background: #eef4ff; }
        .mobile-menu-footer { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 1.2rem; color: #888; }
        .mobile-menu-footer img { max-width: 100px; opacity: 0.7; }

        /* Backdrop overlay */
        .mobile-menu-backdrop { position: fixed; top: var(--nav-h); left: 0; width: 100vw; height: calc(100vh - var(--nav-h)); background: rgba(0,0,0,0.2); z-index: 999; }
      `}</style>
    </>
  );
}
