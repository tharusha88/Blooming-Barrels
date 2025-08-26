import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';
import { getAuthHeaders, isAuthenticated } from '../utils/jwt';

const API_BASE = 'http://localhost:8000';

export default function Checkout({ cart, setCart, user, isLoggedIn }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: user?.address || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Accept direct checkout flag via query OR navigation state
  const isDirectCheckout = location.search.includes('direct=true') || (location.state && location.state.direct);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.debug('Checkout: isDirectCheckout=', isDirectCheckout);
    if (isDirectCheckout) {
      // Prefer navigation state (safer) then fallback to localStorage
      const navItem = location.state && location.state.item;
      if (navItem) {
        console.debug('Checkout: received direct item via navigation state', navItem);
        setCheckoutItems([navItem]);
        // try to remove fallback localStorage copy
        try { localStorage.removeItem('directCheckoutItem'); } catch(e){}
      } else {
        const directItem = localStorage.getItem('directCheckoutItem');
        console.debug('Checkout: directCheckoutItem (raw)=', directItem);
        if (directItem) {
          try {
            const parsedItem = JSON.parse(directItem);
            console.debug('Checkout: parsed direct item=', parsedItem);
            setCheckoutItems([parsedItem]);
          } catch (e) {
            console.error('Checkout: failed to parse directCheckoutItem', e);
            setError('Invalid checkout item.');
          }
          try { localStorage.removeItem('directCheckoutItem'); } catch(e){}
        } else {
          console.warn('Checkout: no directCheckoutItem found, redirecting to shop');
          setError('No product found for direct checkout.');
          // delay brief so user sees message in UI before redirect
          setTimeout(() => navigate('/shop'), 700);
        }
      }
    } else {
      setCheckoutItems(cart);
    }
    setLoading(false);
  }, [isDirectCheckout, cart, navigate]);

  const cartTotal = checkoutItems.reduce((sum, item) => sum + (item.basePrice || item.price) * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.address || !formData.email || !formData.phone) {
      setError('Please fill in all fields.');
      return;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!/^[0-9]{9,15}$/.test(formData.phone)) {
      setError('Phone must be digits only (9-15 numbers).');
      return;
    }
    if (formData.address.trim().length < 5) {
      setError('Address must be at least 5 characters.');
      return;
    }
    if (!isLoggedIn || !isAuthenticated()) {
      setError('Please log in to place an order.');
      return;
    }
    if (!checkoutItems.length) {
      setError('No items to checkout.');
      return;
    }
    setSubmitting(true);
    const orderData = {
      user_id: user?.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: checkoutItems.map((item) => ({
        product_id: item.id || item.product_id,
        quantity: item.quantity,
        price: item.basePrice || item.price,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,
      })),
      total: cartTotal,
    };
    try {
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const res = await fetch(`${API_BASE}/controllers/OrderController.php`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(orderData),
      });
      const responseText = await res.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        setError('Server returned invalid response. Please try again.');
        setSubmitting(false);
        return;
      }
      if (res.ok && data.success) {
        if (!isDirectCheckout) setCart([]);
        navigate('/order-success');
      } else {
        setError(data.message || 'Failed to place order.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-container loading">
        <div className="loader"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="checkout-container error">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }
  return (
    <div className="checkout-container">
      <h1>{isDirectCheckout ? 'Quick Checkout' : 'Checkout'}</h1>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="checkout-items-grid">
          {checkoutItems.map((item, index) => (
            <div key={item.uniqueId || item.id || index} className="checkout-item-card">
              <img src={item.image || item.image_url} alt={item.name} className="checkout-item-image" />
              <div className="checkout-item-details">
                <h4>{item.name}</h4>
                {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                <p>Quantity: {item.quantity}</p>
                <p className="checkout-item-price">Rs {(item.basePrice || item.price) * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-total">
          <h3>Total: Rs {cartTotal}</h3>
        </div>
      </div>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Full Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Address
            <textarea name="address" value={formData.address} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </label>
        </div>
        <button type="submit" className="place-order" disabled={submitting}>
          {submitting ? 'Placing Order...' : isDirectCheckout ? 'Complete Purchase' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
