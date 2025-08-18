import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ajaxUse from "../utils/remote/ajaxUse";
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
      const server_response = await ajaxUse.login(data);
      if (server_response.status === "OK") {
        localStorage.setItem("sacco", server_response.details);
        localStorage.setItem("loginTime", Date.now().toString());

        const access_token = server_response.details; // token from PHP
        const decoded_token = jwtDecode(access_token);

        const roleId = decoded_token.data.role_id;
        console.log("User Role ID:", roleId);

        if (roleId === "1") {
          navigate("/saver-dashboard");
        } else if (roleId === "2") {
          navigate("/manager-dashboard");
        }
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    }
  };

  return (
    <div className="scrollable-page">
      <div className="login-page">
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
    </div>
  );
};

export default Login;
