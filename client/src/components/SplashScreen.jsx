import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import logo from '../assets/images/logo.png';

const SplashScreen = ({ onFinish }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      document.body.style.overflow = prevOverflow;

      if (typeof onFinish === 'function') onFinish();

      const role = localStorage.getItem('userRole');
      if (role === 'manager') {
        navigate('/manager-dashboard', { replace: true });
      } else if (role) {
        navigate('/saver-dashboard', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, [navigate, onFinish]);

  return (
    <div className="splash-container" role="status" aria-live="polite" aria-label="Loading">
      <div className="splash-content">
        <img src={logo} alt="Trinity SACCO Logo" className="splash-logo" />
        <div className="wave-loader" aria-hidden="true">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
};

export default SplashScreen;
