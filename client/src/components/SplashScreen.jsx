import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import logo from '../assets/images/logo.png';

const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState('fade-in'); // 'fade-in' | 'fade-out'
  const navigate = useNavigate();

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
      // Redirect to /home after 3s
      navigate('/home', { replace: true });
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(endTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [navigate, onFinish]);

  return (
    <div className="splash-container" aria-label="Loading">
      <img src={logo} alt="App Logo" className={`splash-logo ${phase}`} />
    </div>
  );
};

export default SplashScreen;
