import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import logo from '../assets/images/logo.png';

const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState('fade-in'); // 'fade-in' | 'fade-out'

  useEffect(() => {
    // Lock scrolling while splash is visible
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const fadeOutTimer = setTimeout(() => {
      setPhase('fade-out');
    }, 2000); // start fade-out at 2s

    const endTimer = setTimeout(() => {
      // Restore scrolling
      document.body.style.overflow = prevOverflow;
      if (typeof onFinish === 'function') onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(endTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [onFinish]);

  return (
    <div className="splash-container" aria-label="Loading">
      <img src={logo} alt="App Logo" className={`splash-logo ${phase}`} />
    </div>
  );
};

export default SplashScreen;
