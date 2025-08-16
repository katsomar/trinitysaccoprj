import React, { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ResponsiveSideMenu from "../components/ResponsiveSideMenu";
import { FaHome, FaInfoCircle, FaUserPlus, FaSignInAlt, FaHeadset } from "react-icons/fa";
import "../styles/main.css";

const navLinks = [
  { to: "/", text: <> <FaHome className="nav-icon" /> Home </>, onClick: () => window.location.href = "/" },
  { to: "/about", text: <> <FaInfoCircle className="nav-icon" /> About </>, onClick: () => window.location.href = "/about" },
  { to: "/signup", text: <> <FaUserPlus className="nav-icon" /> Sign Up </>, onClick: () => window.location.href = "/signup" },
  { to: "/login", text: <> <FaSignInAlt className="nav-icon" /> Login </>, onClick: () => window.location.href = "/login" },
  { to: "/customer-service", text: <> <FaHeadset className="nav-icon" /> Customer Service </>, onClick: () => window.location.href = "/customer-service" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const data = { email, password };

    try {
      const response = await axios.post(
        "http://localhost/trinitySacco/server/api/auth/login.php",
        data
      );
      const result = response.data;
      console.log("Login response:", result); // Debug log

      if (result.message === "Login successful") {
        // Store token and user info
        localStorage.setItem("token", result.token);
        localStorage.setItem("userName", result.name);
        localStorage.setItem("userRole", result.role);

        alert("Login successful!");

        // Redirect based on role
        navigate(
          result.role === "manager" ? "/manager-dashboard" : "/saver-dashboard"
        );
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="login-page scrollable-page">
      {/* Responsive Top Nav & Side Menu */}
      <ResponsiveSideMenu
        logoSrc="/images/logo.png"
        navLinks={navLinks}
      />
      {/* Desktop NavBar (hidden on small/medium screens) */}
      <nav className="navbar desktop-navbar">
        <img src="/images/logo.png" alt="Trinity SACCO Logo" className="logo" />
        <ul className="nav-links">
          <li>
            <a href="/"><FaHome className="nav-icon" /> Home</a>
          </li>
          <li>
            <a href="/about"><FaInfoCircle className="nav-icon" /> About</a>
          </li>
          <li>
            <a href="/signup"><FaUserPlus className="nav-icon" /> Sign Up</a>
          </li>
          <li>
            <a href="/login"><FaSignInAlt className="nav-icon" /> Login</a>
          </li>
          <li>
            <a href="/customer-service"><FaHeadset className="nav-icon" /> Customer Service</a>
          </li>
        </ul>
      </nav>
      <div className="login-container">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"} // password is hidden by default
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ cursor: "pointer", marginLeft: 8 }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
