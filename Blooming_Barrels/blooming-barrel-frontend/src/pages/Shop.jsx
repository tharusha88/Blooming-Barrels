import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navigation/Navbar';
import { toast } from 'react-toastify';
import ShopHero from './Shop/components/ShopHero';
import './Shop/Shop.css';
import ProductCard from "./Shop/components/ProductCard";
import { useNavigate } from "react-router-dom";


const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000'  // PHP server
  : '';


import { getStoredUser, getStoredToken } from '../utils/jwt';

export default function Shop({ cart, setCart, isLoggedIn: isLoggedInProp }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [customOptions, setCustomOptions] = useState({});
  const [success, setSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp || false);
  const navigate = useNavigate();

  // Restore login state from localStorage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    if (storedUser && storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Try multiple API endpoints in order of preference
    const tryFetchProducts = async () => {
      const endpoints = [
        `${API_BASE}/api/products`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const res = await fetch(endpoint);
          console.log(`API Response Status for ${endpoint}:`, res.status, res.statusText);
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          const data = await res.json();
          console.log(`API Response Data from ${endpoint}:`, data);
          
          if (data.success && data.products) {
            setProducts(data.products);
            console.log('Successfully loaded products from:', endpoint);
            console.log('Data source:', data.dataSource || 'unknown');
            console.log('Total products:', data.totalProducts || data.products.length);
            return; // Success, exit the loop
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${endpoint}:`, err.message);
          continue; // Try next endpoint
        }
      }
      
      // If all endpoints fail, set error
      throw new Error('All API endpoints failed to respond');
    };
    
    tryFetchProducts()
      .catch(err => {
        console.error('All Products API endpoints failed:', err);
        setError('Failed to load products from server. Please check if the backend is running.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array to prevent repeated calls

 const handleCustomize = useCallback((product) => {
  navigate(`/product/${product.id}`, { state: { product } });
}, [navigate]);

  // Handle adding products directly to cart from product cards
  const handleAddToCartFromCard = useCallback(async (product) => {
    try {
      console.log('handleAddToCartFromCard called with:', product);
      console.log('Current cart:', cart);
      
      // Ensure product has an ID (use name as fallback identifier)
      const productId = product.id || product.name;
      const productToAdd = { ...product, id: productId };
      
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(item => 
        (item.id && item.id === productId) || 
        (item.name === product.name)
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
        console.log('Updated existing item quantity');
      } else {
        // Add new item to cart
        const newCart = [...cart, { ...productToAdd, quantity: 1 }];
        setCart(newCart);
        console.log('Added new item to cart:', newCart);
      }
      
      // Show success message with custom styling
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🛒</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{product.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Added to cart successfully!</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: '#222',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          },
          toastId: `cart-${productId}`, // Prevent duplicate toasts for same product
        }
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, [cart, setCart]);

  const handleAddToCart = useCallback(() => {
    setCart([...cart, { ...customizingProduct, ...customOptions, quantity: 1 }]);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
    setCustomizingProduct(null);
  }, [cart, customizingProduct, customOptions, setCart]);

  const handleOptionChange = useCallback((optionType, value) => {
    setCustomOptions((prev) => ({ ...prev, [optionType]: value }));
  }, []);

  const triggerLoginPrompt = useCallback(() => setShowLoginPrompt(true), []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} cartCount={cart?.length || 0} />
      <div className="shop-container">
        <ShopHero />
        
        <div className="product-grid">
          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              Loading products...
            </div>
          ) : error ? (
            <div className="error-message" style={{ color: 'red' }}>
              ❌ {error}
              <button onClick={() => window.location.reload()} style={{ marginLeft: '10px' }}>
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products-message">No products available</div>
          ) : (
            products.map((product) => (
              <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price !== undefined ? `Rs ${product.price}` : 'Rs 0.00'}
                  image={product.image_url || ''}
                  product={product}
                  triggerLoginPrompt={triggerLoginPrompt}
                  onCustomize={() => handleCustomize(product)}
                  onAddToCart={handleAddToCartFromCard}
                  isLoggedIn={isLoggedIn}
                />
            ))
          )}
        </div>

{customizingProduct && (
  <div className="custom-modal">
    <div className="custom-box">
      <h3>Customize: {customizingProduct.name}</h3>
<label>
  Pot Color:
  <select
    value={customOptions.potColor}
    onChange={e => handleOptionChange('potColor', e.target.value)}
  >
    {customizingProduct.options.potColor.map(color => (
      <option key={color} value={color}>{color}</option>
    ))}
  </select>
</label>
<label>
  Pebbles Color:
  <select
    value={customOptions.pebblesColor}
    onChange={e => handleOptionChange('pebblesColor', e.target.value)}
  >
    {customizingProduct.options.pebblesColor.map(color => (
      <option key={color} value={color}>{color}</option>
    ))}
  </select>
</label>
      {/* Plant selection dropdown and images */}
      {customizingProduct.options.plant && (
        <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
          {customizingProduct.options.plant.map(plant => (
            <img
              key={plant.name}
              src={plant.image}
              alt={plant.name}
              title={plant.name}
              style={{
                width: 48,
                height: 48,
                border: customOptions.plant === plant.name ? '2px solid green' : '1px solid #ccc',
                borderRadius: 6,
                cursor: 'pointer'
              }}
              onClick={() => handleOptionChange('plant', plant.name)}
            />
          ))}
        </div>
      )}
      {customizingProduct.options.material && (
        <label>
          Material:
          <select
            value={customOptions.material}
            onChange={e => handleOptionChange('material', e.target.value)}
          >
            {customizingProduct.options.material.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </label>
      )}
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={() => setCustomizingProduct(null)}>Close</button>
      {success && <div className="success">Added to cart!</div>}
    </div>
  </div>
)}

        {showLoginPrompt && (
          <div className="login-modal-overlay" onClick={() => setShowLoginPrompt(false)}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
              <h3>Please log in or sign up</h3>
              <button onClick={() => navigate('/login')}>Log In</button>
              <button onClick={() => navigate('/signup')}>Sign Up</button>
              <button onClick={() => setShowLoginPrompt(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
