import React, { useState } from 'react';
import '../styles/main.css';
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setSuccess('Signup successful!');
        // Add API call logic here
    };

    return (
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
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaPhone className="input-icon" />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaUserTag className="input-icon" />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
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
                            type={showPassword ? "text" : "password"} // password is hidden by default
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ cursor: 'pointer', marginLeft: 8 }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type={showConfirmPassword ? "text" : "password"} // password is hidden by default
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            style={{ cursor: 'pointer', marginLeft: 8 }}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit" className="btn">Sign Up</button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
