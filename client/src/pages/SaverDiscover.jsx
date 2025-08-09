import React from "react";
import "../styles/discover.css";
import "../styles/managerDiscover.css";
import "../styles/transactions.css";
import SaverTopNav from "../components/SaverTopNav";

const mockGroups = [
  { id: "g1", name: "Education Fund", members: 24 },
  { id: "g2", name: "Business Group", members: 15 },
  { id: "g3", name: "Holiday Club", members: 8 },
  { id: "g4", name: "Women Empowerment", members: 32 },
  { id: "g5", name: "Farmers SACCO", members: 19 },
];

function SaverDiscover() {
  return (
    <div className="discover-root">
      {/* Shared Saver Top Nav */}
      <SaverTopNav />

      {/* Main Body Content (mirrors ManagerDiscover) */}
      <div className="manager-discover-main-bg">
        <div className="manager-discover-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',marginBottom:'0.7rem'}}>
          <div className="manager-discover-title">Discover</div>
          <button className="btn tx-back-btn" onClick={() => window.location.href = "/saver-dashboard"}>Back to Dashboard</button>
        </div>
        <div className="manager-discover-3col">
          {/* Left Sidebar */}
          <aside className="manager-discover-sidebar">
            <div className="manager-discover-ad-card">Advertisement</div>
            <div className="manager-discover-ad-card">Advertisement</div>
            <div className="manager-discover-ad-card">Advertisement</div>
          </aside>

          {/* Main Content */}
          <main className="manager-discover-main">
            {/* Trending Groups */}
            <section className="manager-discover-section">
              <div className="manager-discover-section-title">Trending Groups</div>
              <div className="manager-discover-trending-grid">
                {mockGroups.map(g => (
                  <div className="manager-discover-group-card" key={g.id}>
                    <div className="manager-discover-group-title">{g.name}</div>
                    <div className="manager-discover-group-meta">{g.members} members</div>
                    <div className="manager-discover-group-rate">Interest: {(6 + g.id.length * 0.5).toFixed(2)}%</div>
                    <button className="manager-discover-join-btn">Join</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Best Interest Rates */}
            <section className="manager-discover-section">
              <div className="manager-discover-section-title">Best Interest Rates</div>
              <div className="manager-discover-rate-list">
                {[
                  { inst: "Equity Bank", type: "Fixed Deposit", rate: "12.5%" },
                  { inst: "Stanbic Bank", type: "Savings Account", rate: "10.2%" },
                  { inst: "DTB Uganda", type: "SACCO Partner", rate: "9.8%" },
                  { inst: "PostBank", type: "Group Savings", rate: "8.7%" },
                ].map((r, i) => (
                  <div className="manager-discover-rate-card" key={i}>
                    <div className="manager-discover-rate-inst">{r.inst}</div>
                    <div className="manager-discover-rate-type">{r.type}</div>
                    <div className="manager-discover-rate-val">{r.rate}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Opportunities from Banks */}
            <section className="manager-discover-section">
              <div className="manager-discover-section-title">Opportunities from Banks</div>
              <div className="manager-discover-bank-grid">
                {[
                  { img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", title: "Stanbic Youth Account", desc: "Open a youth account and enjoy zero monthly fees plus free mobile banking." },
                  { img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", title: "Equity Fixed Deposit", desc: "Earn up to 12.5% p.a. on fixed deposits above UGX 5M." },
                  { img: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=400&q=80", title: "DTB Group Savings", desc: "Special group rates for SACCOs and investment clubs." },
                ].map((b, i) => (
                  <div className="manager-discover-bank-card" key={i}>
                    <img className="manager-discover-bank-img" src={b.img} alt={b.title} />
                    <div className="manager-discover-bank-title">{b.title}</div>
                    <div className="manager-discover-bank-desc">{b.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Additional Sections */}
            <section className="manager-discover-section">
              <div className="manager-discover-section-title">Most Popular Managers</div>
              <div className="manager-discover-placeholder">Coming soon: Top managers in your region.</div>
            </section>
            <section className="manager-discover-section">
              <div className="manager-discover-section-title">Investment Deals</div>
              <div className="manager-discover-placeholder">Coming soon: Investment opportunities for SACCO members.</div>
            </section>
          </main>

          {/* Right Sidebar */}
          <aside className="manager-discover-sidebar">
            <div className="manager-discover-ad-card">Advertisement</div>
            <div className="manager-discover-ad-card">Advertisement</div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SaverDiscover;
