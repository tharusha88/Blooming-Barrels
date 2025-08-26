import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopCart.css';

const API_BASE = 'http://localhost:8000';

function ShopCart({ cart, setCart }) {
  const navigate = useNavigate();

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleChangeQuantity = (index, delta) => {
    setCart(cart.map((item, i) =>
      i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
    }
  };

  const handleCheckout = async () => {
    navigate('/checkout');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <button className="back-button" onClick={() => navigate("/shop")}>← Back to Shop</button>

      {cart.length === 0 ? (
        <div className="empty-cart-cta">
          <span role="img" aria-label="shopping cart" style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
          <p>Your cart is empty.</p>
          <button onClick={() => navigate('/shop')} className="shop-now-btn">Shop Now</button>
        </div>
      ) : (
        <>
          <ul>
            {cart.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <strong>{item.name}</strong>
                  <div>Size: {item.size}</div>
                  <div>Color: {item.color}</div>
                  {item.material && <div>Material: {item.material}</div>}
                  <div>
                    Quantity:
                    <button className="qty-btn" onClick={() => handleChangeQuantity(idx, -1)}>-</button>
                    <span className="qty-count">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleChangeQuantity(idx, 1)}>+</button>
                  </div>
                  <div>Subtotal: Rs {(item.basePrice * item.quantity).toLocaleString()}</div>
                  <button className="remove-btn" onClick={() => handleRemoveFromCart(idx)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: Rs {cartTotal.toLocaleString()}</h3>
          <button className="clear-button" onClick={handleClearCart}>Clear Cart</button>
          <button onClick={handleCheckout} className="checkout-button">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default ShopCart; 