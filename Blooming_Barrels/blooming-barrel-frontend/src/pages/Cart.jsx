import React from 'react';
import Navbar from '../components/Navigation/Navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getStoredToken, clearAuth } from '../utils/jwt';

export default function Cart() {
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
        <h1>Shopping Cart</h1>
        <p>Your selected plants and garden supplies.</p>
        {cartCount === 0 ? (
          <p>Your cart is empty. Start shopping to add items!</p>
        ) : (
          <p>You have {cartCount} items in your cart.</p>
        )}
      </div>
    </div>
  );
}
