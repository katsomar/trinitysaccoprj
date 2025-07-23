import React, { useState } from "react";
import axios from "../utils/axiosConfig"; // Use the configured Axios instance
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    var data = {
      email: email,
      password: password,
    };
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/login.php`, data)
      .then((response) => {
        // {"status":"failed","message":"User not found"}
        if (response.data.status == "success") {
          alert(response.data.message);
          navigate(
            response.data.details.role === "manager"
              ? "/manager-dashboard"
              : "/saver-dashboard"
          );
        } else if (response.data.status == "failed") {
          alert(response.data.message);
        }
      })
      .catch(() => setError("An error occurred. Please try again."));
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
