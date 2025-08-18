import React, { useEffect, useState } from "react";
import axios from "axios";

import "../styles/main.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import ajaxUse from "../utils/remote/ajaxUse";
import Select from "react-select";
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

    const res = await ajaxUse.createUse(data);
    console.log(res);
    if (res.status === "OK") {
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
  };

  const listRoles = async () => {
    const res = await ajaxUse.listRole();
    console.log(res);
    if (res.status === "OK") {
      setRoleList(res.details);
    } else {
      setRoleList([]);
    }
  };

  return (
    <div className="scrollable-page">
      <div className="signup-page">
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
              <Select
                onChange={(e) => setRole(e.role_id)}
                getOptionLabel={(option) => option.role_name}
                getOptionValue={(option) => option.role_id}
                isSearchable
                options={Array.isArray(roleList) ? roleList : []}
                value={
                  Array.isArray(roleList) &&
                  roleList.find((value) => value.role_id === role)
                }
              />
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
    </div>
  );
};

export default Signup;
