import React from 'react';
import Navbar from '../components/Navigation/Navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getStoredToken, clearAuth } from '../utils/jwt';

export default function Templates() {
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
      <div className="page-content" style={{ padding: '2rem', marginTop: '80px' }}>
        <h1>Design Templates</h1>
        <p>AI-powered garden design templates and customization tools.</p>
      </div>
    </div>
  );
}
