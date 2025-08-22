import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './OrderHistory.css';
import { getAuthHeaders } from '../utils/jwt';

const API_BASE = 'http://localhost/backend-php';

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${user.id}/orders`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <h1>Order History</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-container">
        <h1>Order History</h1>
        <p className="error-message">{error}</p>
        <button onClick={fetchOrders} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>Order History</h1>
        <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
          ← Back to Shop
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <span role="img" aria-label="shopping bag" style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🛍️</span>
          <h2>No Orders Yet</h2>
          <p>Start shopping to see your order history here!</p>
          <button onClick={() => navigate('/shop')} className="shop-now-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span className="order-date">{formatDate(order.created_at)}</span>
              </div>
              <p>Status: {order.status}</p>
              <p>Total: Rs {order.total}</p>
              <Link to={`/orders/${order.id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 