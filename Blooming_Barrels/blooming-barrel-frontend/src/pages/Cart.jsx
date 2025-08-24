import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navigation/Navbar';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getStoredToken, clearAuth } from '../utils/jwt';
import { updateCartItem, removeFromCart } from '../utils/api';
import { useCart } from '../context/CartContext';
import './Cart.css';

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
    <div className="cart-container">
      <Navbar
        cartCount={cartCount}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div className="cart-content">
        <h1 className="cart-title">Your Garden Cart</h1>
        <p className="cart-subtitle">Your selected plants and garden supplies.</p>
        {loading ? (
          <p className="cart-loading">Loading your cart...</p>
        ) : error ? (
          <p className="cart-error">{error}</p>
        ) : cartCount === 0 ? (
          <p className="cart-empty">Your cart is empty. Start shopping to add your favorite plants!</p>
        ) : (
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product_id}>
                    <td>{item.product_name || item.name || 'Product #' + item.product_id}</td>
                    <td>
                      <img 
                        src={item.image_url || '/placeholder.png'} 
                        alt={item.product_name || item.name || 'Product'} 
                        className="cart-item-image"
                      />
                    </td>
                    <td>{item.price ? `₱${item.price}` : '-'}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.product_id, parseInt(e.target.value, 10))}
                        className="cart-quantity-input"
                      />
                    </td>
                    <td>{item.price ? `₱${(item.price * item.quantity).toFixed(2)}` : '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleRemove(item.product_id)} 
                        className="cart-remove-button"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-total">
              Total: ₱{cart.reduce((sum, item) => sum + (item.price ? item.price * item.quantity : 0), 0).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}