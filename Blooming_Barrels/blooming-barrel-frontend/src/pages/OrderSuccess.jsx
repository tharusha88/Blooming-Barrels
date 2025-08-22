import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css'; 

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="checkout-container">
      <h1>🎉 Thank You for Your Order!</h1>
      <p>Your order was placed successfully. We'll process it shortly.</p>
      <div className="success-actions">
        <button onClick={() => navigate("/")}>Return to Home</button>
        <button onClick={() => navigate("/order-history")} className="view-orders-btn">
          View Order History
        </button>
      </div>
    </div>
  );
}
