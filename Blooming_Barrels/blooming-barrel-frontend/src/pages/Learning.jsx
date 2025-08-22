import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';
import { getStoredUser, getStoredToken, clearAuth } from '../utils/jwt';

const Learning = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      <Navbar 
        cartCount={cartCount}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div style={{ padding: '2rem', textAlign: 'center', marginTop: '80px' }}>
        <h1>Learning Hub</h1>
        <p>Expert guides, tips, and resources for successful gardening.</p>
        <p style={{ color: '#666', marginTop: '2rem' }}>Coming Soon!</p>
      </div>
    </div>
  );
};

export default Learning;
