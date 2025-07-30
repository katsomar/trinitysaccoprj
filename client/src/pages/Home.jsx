import React, { useState, useEffect } from 'react';
import '../styles/main.css';


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
        <div className="scrollable-page">
            <div className="home">
                <div
                    className="hero"
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
        </div>
    );
};

export default Home;
