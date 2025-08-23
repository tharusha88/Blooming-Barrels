

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navigation/Navbar';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getStoredToken, clearAuth } from '../utils/jwt';
import { updateCartItem, removeFromCart } from '../utils/api';
import { useCart } from '../context/CartContext';


export default function Cart() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(!!getStoredUser() && !!getStoredToken());
  const { cart, cartCount, fetchCart, loading } = useCart();

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleQuantityChange = async (product_id, newQuantity) => {
    if (newQuantity < 1) return;
    const res = await updateCartItem(product_id, newQuantity);
    if (res.success) {
      fetchCart();
    } else {
      setError(res.error || 'Failed to update cart item');
    }
  };

  const handleRemove = async (product_id) => {
    const res = await removeFromCart(product_id);
    if (res.success) {
      fetchCart();
    } else {
      setError(res.error || 'Failed to remove item');
    }
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
        {loading ? (
          <p>Loading cart...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : cartCount === 0 ? (
          <p>Your cart is empty. Start shopping to add items!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Product</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Price</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Quantity</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Total</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product_id}>
                    <td style={{ padding: '8px' }}>{item.product_name || item.name || 'Product #' + item.product_id}</td>
                    <td style={{ padding: '8px' }}>{item.price ? `₱${item.price}` : '-'}</td>
                    <td style={{ padding: '8px' }}>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.product_id, parseInt(e.target.value, 10))}
                        style={{ width: '60px' }}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>{item.price ? `₱${(item.price * item.quantity).toFixed(2)}` : '-'}</td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => handleRemove(item.product_id)} style={{ color: 'red' }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
              Total: ₱{cart.reduce((sum, item) => sum + (item.price ? item.price * item.quantity : 0), 0).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
