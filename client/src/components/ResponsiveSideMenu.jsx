import React, { useState, useEffect } from "react";

const ResponsiveSideMenu = ({
  logoSrc = "/images/logo.png",
  navLinks = [],
  menuClass = "",
  logoClass = "",
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top NavBar */}
      <nav className={`navbar ${menuClass}`}>
        <img src={logoSrc} alt="Logo" className={`logo ${logoClass}`} />
        {/* Hamburger/Close icon */}
        <button
          className={`hamburger-toggle${open ? " active" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="side-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
      {/* Backdrop */}
      {open && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      {/* Side Menu */}
      <nav
        id="side-menu"
        className={`mobile-side-menu${open ? " open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label="Mobile Navigation"
      >
        <ul className="mobile-nav-links">
          {navLinks.map((link) => (
            <li key={link.to} onClick={() => { setOpen(false); link.onClick && link.onClick(); }}>
              {link.icon && <span style={{ marginRight: "8px" }}>{link.icon}</span>}
              {link.text}
            </li>
          ))}
        </ul>
        <div className="mobile-menu-footer">
          <img src={logoSrc} alt="Logo" />
        </div>
      </nav>
      {/* Styles (reuse SaverDashboard styles) */}
      <style>{`
        .hamburger-toggle {
          position: fixed;
          top: 10px;
          right: 14px;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .hamburger-toggle span {
          position: absolute;
          width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: transform 0.28s ease, opacity 0.2s ease, top 0.28s ease; left: 10px;
        }
        .hamburger-toggle span:nth-child(1) { top: 14px; }
        .hamburger-toggle span:nth-child(2) { top: 20px; }
        .hamburger-toggle span:nth-child(3) { top: 26px; }
        .hamburger-toggle.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hamburger-toggle.active span:nth-child(2) { opacity: 0; }
        .hamburger-toggle.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .mobile-side-menu {
          position: fixed;
          top: 60px;
          left: 0;
          width: min(84vw, 340px);
          height: calc(100vh - 60px);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border-right: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transform: translateX(-102%);
          transition: transform 0.32s ease;
          z-index: 1000;
          padding: 1rem 1rem 1.2rem 1rem;
          overflow-y: auto;
        }
        .mobile-side-menu.open { transform: translateX(0); }
        .mobile-nav-links { list-style: none; padding: 0; margin: 0.5rem 0 1rem 0; }
        .mobile-nav-links li { padding: 0.7rem 0.8rem; margin-bottom: 0.5rem; border-radius: 10px; background: rgba(255,255,255,0.9); border: 1px solid #e3e6ee; color: #004080; font-weight: 600; cursor: pointer; transition: background 0.2s ease; }
        .mobile-nav-links li:hover { background: #eef4ff; }
        .mobile-menu-footer { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 1.2rem; color: #888; }
        .mobile-menu-footer img { max-width: 100px; opacity: 0.7; }
        .mobile-menu-backdrop {
          position: fixed;
          top: 60px;
          left: 0;
          width: 100vw;
          height: calc(100vh - 60px);
          background: rgba(0,0,0,0.2);
          z-index: 999;
        }
        @media (min-width: 1025px) {
          .hamburger-toggle, .mobile-side-menu, .mobile-menu-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default ResponsiveSideMenu;
