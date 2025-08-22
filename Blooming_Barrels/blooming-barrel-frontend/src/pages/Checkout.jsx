import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css'; // ✅ for styling
import { getAuthHeaders, isAuthenticated } from '../utils/jwt';

const API_BASE = 'http://localhost/backend-php';

export default function Checkout({ cart, setCart, user, isLoggedIn }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a direct checkout from "Buy Now"
  const isDirectCheckout = location.search.includes('direct=true');

  useEffect(() => {
    if (isDirectCheckout) {
      // Get the direct checkout item from localStorage
      const directItem = localStorage.getItem('directCheckoutItem');
      if (directItem) {
        const parsedItem = JSON.parse(directItem);
        setCheckoutItems([parsedItem]);
        // Clean up localStorage
        localStorage.removeItem('directCheckoutItem');
      } else {
        // If no direct item found, redirect to shop
        navigate('/shop');
      }
    } else {
      // Use regular cart items
      setCheckoutItems(cart);
    }
  }, [isDirectCheckout, cart, navigate]);

  // Debug logging
  console.log('Checkout component - user prop:', user);
  console.log('Checkout component - isLoggedIn prop:', isLoggedIn);
  console.log('Checkout component - isAuthenticated:', isAuthenticated());
  console.log('Checkout component - isDirectCheckout:', isDirectCheckout);
  console.log('Checkout component - checkoutItems:', checkoutItems);

  const cartTotal = checkoutItems.reduce((sum, item) => sum + (item.basePrice || item.price) * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.email || !formData.phone) {
      alert("Please fill in all fields.");
      return;
    }
    // Input validations
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (formData.name.trim().length < 2) {
      alert('Name must be at least 2 characters.');
      return;
    }
    if (!/^[0-9]{9,15}$/.test(formData.phone)) {
      alert('Phone must be digits only (9-15 numbers).');
      return;
    }
    if (formData.address.trim().length < 5) {
      alert('Address must be at least 5 characters.');
      return;
    }

    // Check if user is logged in
    if (!isLoggedIn || !isAuthenticated()) {
      alert("Please log in to place an order.");
      return;
    }

    const orderData = {
      user_id: user?.id, // <-- Add this line!
      name: user?.name || formData.name,
      email: user?.email || formData.email,
      phone: user?.phone || formData.phone,
      address: user?.address || formData.address,
      items: checkoutItems,
      total: checkoutItems.reduce((sum, item) => sum + (item.basePrice || item.price) * item.quantity, 0)
    };

    try {
      const res = await fetch('http://localhost/backend-php/controllers/OrderController.php', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });

      // Check if response is empty or not JSON
      const responseText = await res.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText);
        alert("Server returned invalid response. Please try again.");
        return;
      }

      if (res.ok) {
        // Only clear cart if this was a regular cart checkout
        if (!isDirectCheckout) {
          setCart([]);
        }
        navigate('/order-success');
      } else {
        alert("Failed to place order: " + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Network error:', err);
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h1>{isDirectCheckout ? 'Quick Checkout' : 'Checkout'}</h1>

      {/* Order Summary */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        {checkoutItems.map((item, index) => (
          <div key={item.uniqueId || index} className="checkout-item">
            <img src={item.image} alt={item.name} className="checkout-item-image" />
            <div className="checkout-item-details">
              <h4>{item.name}</h4>
              {item.selectedColor && <p>Color: {item.selectedColor}</p>}
              {item.selectedSize && <p>Size: {item.selectedSize}</p>}
              <p>Quantity: {item.quantity}</p>
              <p className="checkout-item-price">Rs {(item.basePrice || item.price) * item.quantity}</p>
            </div>
          </div>
        ))}
        <div className="checkout-total">
          <h3>Total: Rs {cartTotal}</h3>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Address
          <textarea name="address" value={formData.address} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Phone
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>

        <button type="submit" className="place-order">
          {isDirectCheckout ? 'Complete Purchase' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
