import React, { useEffect, useState } from "react";
import axios from "axios";
import ResponsiveSideMenu from "../components/ResponsiveSideMenu";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHome,
  FaInfoCircle,
  FaUserPlus,
  FaSignInAlt,
  FaHeadset,
} from "react-icons/fa";

import "../styles/main.css";

// Define nav links for Signup page
const navLinks = [
  {
    to: "/",
    text: (
      <>
        {" "}
        <FaHome className="nav-icon" /> Home{" "}
      </>
    ),
    onClick: () => (window.location.href = "/"),
  },
  {
    to: "/about",
    text: (
      <>
        {" "}
        <FaInfoCircle className="nav-icon" /> About{" "}
      </>
    ),
    onClick: () => (window.location.href = "/about"),
  },
  {
    to: "/signup",
    text: (
      <>
        {" "}
        <FaUserPlus className="nav-icon" /> Sign Up{" "}
      </>
    ),
    onClick: () => (window.location.href = "/signup"),
  },
  {
    to: "/login",
    text: (
      <>
        {" "}
        <FaSignInAlt className="nav-icon" /> Login{" "}
      </>
    ),
    onClick: () => (window.location.href = "/login"),
  },
  {
    to: "/customer-service",
    text: (
      <>
        {" "}
        <FaHeadset className="nav-icon" /> Customer Service{" "}
      </>
    ),
    onClick: () => (window.location.href = "/customer-service"),
  },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleList, setRoleList] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    listRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email || !password || !name || !phone || !role) {
      setError("All fields are required.");
      return;
    }

    const data = {
      name: name,
      email: email,
      phone: phone,
      role_id: role,
      password: password,
    };

    axios
      //Adjust the link to yours Jane!!!!
      .post(`${import.meta.env.VITE_API_URL}/auth/register.php`, data)
      .then((response) => {
        console.log("Response:", response.data); // Debug log
        const res = response.data;
        if (res.status === "success") {
          setSuccess(res.message);
          alert(res.message);
          // Clear form
          setName("");
          setEmail("");
          setPhone("");
          setRole("");
          setPassword("");
          setConfirmPassword("");
        } else {
          setError(res.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className="signup-page scrollable-page">
      {/* Responsive Top Nav & Side Menu */}
      <ResponsiveSideMenu logoSrc="/images/logo.png" navLinks={navLinks} />
      {/* Desktop NavBar (hidden on small/medium screens) */}
      <nav className="navbar desktop-navbar">
        <img
          src="/images/logo.png"
          alt="Trinity SACCO Logo"
          className="logo"
        />
        <ul className="nav-links">
          <li>
            <a href="/">
              <FaHome className="nav-icon" /> Home
            </a>
          </li>
          <li>
            <a href="/about">
              <FaInfoCircle className="nav-icon" /> About
            </a>
          </li>
          <li>
            <a href="/signup">
              <FaUserPlus className="nav-icon" /> Sign Up
            </a>
          </li>
          <li>
            <a href="/login">
              <FaSignInAlt className="nav-icon" /> Login
            </a>
          </li>
          <li>
            <a href="/customer-service">
              <FaHeadset className="nav-icon" /> Customer Service
            </a>
          </li>
        </ul>
      </nav>
      <div className="signup-container">
        <h1>Create an Account</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaUserTag className="input-icon" />
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="saver">Saver</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
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
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={{ cursor: "pointer", marginLeft: 8 }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
