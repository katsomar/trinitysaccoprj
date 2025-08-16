import React, { useState, useEffect } from 'react';
import ResponsiveSideMenu from '../components/ResponsiveSideMenu';
import { FaHome, FaInfoCircle, FaUserPlus, FaSignInAlt, FaHeadset } from 'react-icons/fa';
import '../styles/main.css';


const navLinks = [
    { to: "/", text: <> <FaHome className="nav-icon" /> Home </>, onClick: () => window.location.href = "/" },
    { to: "/about", text: <> <FaInfoCircle className="nav-icon" /> About </>, onClick: () => window.location.href = "/about" },
    { to: "/signup", text: <> <FaUserPlus className="nav-icon" /> Sign Up </>, onClick: () => window.location.href = "/signup" },
    { to: "/login", text: <> <FaSignInAlt className="nav-icon" /> Login </>, onClick: () => window.location.href = "/login" },
    { to: "/customer-service", text: <> <FaHeadset className="nav-icon" /> Customer Service </>, onClick: () => window.location.href = "/customer-service" },
];

const Home = () => {
    const [currentText, setCurrentText] = useState(0);
    const [currentImage, setCurrentImage] = useState(0);

    const animatedTexts = [
        'Join a SACCO Group',
        'Collaborate and grow your savings with others',
        'Track Your Savings',
        'Monitor your financial growth with ease',
    ];

    const backgroundImages = [
        '/images/first.jpeg', // Ensure this file exists in public/images
        '/images/second.jpeg',
        '/images/third.jpeg',
    ];

    useEffect(() => {
        const textInterval = setInterval(() => {
            setCurrentText((prevText) => (prevText + 1) % animatedTexts.length);
        }, 4000); // Sync text change with 4s animation duration

        const imageInterval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % backgroundImages.length);
        }, 5000); // Change background image every 5 seconds

        return () => {
            clearInterval(textInterval);
            clearInterval(imageInterval);
        };
    }, [animatedTexts.length, backgroundImages.length]);

    return (
        <div className="home scrollable-page">
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

            <div className="hero"
                style={{
                    backgroundImage: `url(${backgroundImages[currentImage]})`,
                }}
            >
                <h1>Welcome to Trinity SACCO</h1>
            </div>

            <div className="animated-text">
                <h2 key={currentText}>{animatedTexts[currentText]}</h2>
                <div className="animated-line" />
            </div>
        </div>
    );
};

export default Home;
