import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shop.css';
import { toast } from 'react-toastify';

import ShopHero from './components/ShopHero';
import ShopFeatures from './ShopFeatures';
import ShopFilterBar from './ShopFilterBar';
import ProductGrid from './components/ProductGrid';
import ShopPromo from './ShopPromo';
import ShopCTA from './ShopCTA';
import ShopReviews from './ShopReviews';
import ShopFooter from './ShopFooter';

const ShopPage = ({ cart = [], setCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    try {
      console.log('handleAddToCart called with:', product);
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
      
      // Show success message
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="shop-page">
      <ShopHero cartCount={cart.length} onCartClick={() => navigate('/cart')} />
      <ShopFeatures />
      <ShopFilterBar />
      <div className="container py-5">
        <ProductGrid onAddToCart={handleAddToCart} />
      </div>
      <ShopPromo />
      <ShopCTA />
      <ShopReviews />
      <ShopFooter />
    </div>
  );
};

export default ShopPage;
