import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaUserPlus, FaSignInAlt, FaHeadset } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src="/images/logo.png" alt="Trinity SACCO Logo" className="logo" />
            <ul className="nav-links">
                <li>
                    <Link to="/">
                        <FaHome className="nav-icon" /> Home
                    </Link>
                </li>
                <li>
                    <Link to="/about">
                        <FaInfoCircle className="nav-icon" /> About
                    </Link>
                </li>
                <li>
                    <Link to="/signup">
                        <FaUserPlus className="nav-icon" /> Sign Up
                    </Link>
                </li>
                <li>
                    <Link to="/login">
                        <FaSignInAlt className="nav-icon" /> Login
                    </Link>
                </li>
                <li>
                    <Link to="/customer-service">
                        <FaHeadset className="nav-icon" /> Customer Service
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

