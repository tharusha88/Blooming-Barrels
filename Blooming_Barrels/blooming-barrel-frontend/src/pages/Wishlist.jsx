import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';
import './Wishlist.css';
import { getStoredUser } from '../utils/jwt';
import { fetchWishlist, removeFromWishlist, addToWishlist } from '../api/wishlistAPI';
import { addToCart } from '../utils/api';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      fetchWishlistData();
    } else {
      // Try to fetch wishlist anyway; if not authenticated, backend will return error
      fetchWishlistData();
    }
    // eslint-disable-next-line
  }, []);

  const fetchWishlistData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWishlist();
      if (Array.isArray(res.items)) {
        setWishlist(res.items);
      } else if (Array.isArray(res)) {
        setWishlist(res);
      } else if (res && res.error === 'Please login to use wishlist') {
        setWishlist([]);
        setError('Please login to use wishlist');
        navigate('/login');
      } else {
        setWishlist([]);
        setError('Failed to fetch wishlist');
      }
    } catch (err) {
      // If error is auth-related, redirect to login
      if (err.message && err.message.toLowerCase().includes('login')) {
        setError('Please login to use wishlist');
        navigate('/login');
      } else {
        setError('Failed to fetch wishlist');
      }
      setWishlist([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item.product_id !== productId));
    } catch (err) {
      setError('Failed to remove item from wishlist');
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await addToCart(productId, 1);
      if (res.success) {
        await handleRemove(productId);
      } else {
        setError('Failed to add item to cart');
      }
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar user={user} />
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Garden Wishlist</h1>
          <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
            ← Back to Shop
          </button>
        </div>
        {loading ? (
          <p className="wishlist-loading">Loading your wishlist...</p>
        ) : error ? (
          <div className="wishlist-error">
            <p>{error}</p>
            <button onClick={fetchWishlistData} className="retry-button">Retry</button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <h2>Your wishlist is empty</h2>
            <p>Add your favorite plants to see them here.</p>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlist.map((item) => (
              <div key={item.product_id} className="wishlist-item">
                <img 
                  src={item.image_url || '/placeholder.png'} 
                  alt={item.product_name || item.name || 'Product'} 
                  className="item-image" 
                />
                <div className="item-details">
                  <h3>{item.product_name || item.name || `Product #${item.product_id}`}</h3>
                  <p>Price: ₱{item.price}</p>
                </div>
                <div className="item-actions">
                  <button 
                    onClick={() => handleAddToCart(item.product_id)} 
                    className="btn-add-to-cart"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => handleRemove(item.product_id)} 
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}