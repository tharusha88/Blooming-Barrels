import React, { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiShoppingCart as ShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import wishlistService from '../../../services/wishlistService';
import "./ProductCard.css";

const ProductCard = memo(function ProductCard({ name, price, image, onCustomize, product, onAddToCart, isLoggedIn }) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isLoggedIn || !wishlistService.isAuthenticated()) {
        setIsInWishlist(false);
        return;
      }

      try {
        const inWishlist = await wishlistService.isInWishlist(product.id);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [product.id, isLoggedIn]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Cart button clicked!', { product, onAddToCart });
    
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      if (onAddToCart) {
        console.log('Calling onAddToCart with product:', product);
        await onAddToCart(product);
        // Toast notification is handled in the parent component
      } else {
        console.error('onAddToCart function not provided!');
        toast.error('Cart functionality not available');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isLoggedIn || !wishlistService.isAuthenticated()) {
      toast.error('Please log in to use wishlist');
      return;
    }
    
    if (wishlistLoading) return;
    
    setWishlistLoading(true);
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(product.id);
        setIsInWishlist(false);
        toast.success(`${name} removed from wishlist`);
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(product.id);
        setIsInWishlist(true);
        toast.success(`${name} added to wishlist`);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      if (error.message.includes('Authentication required')) {
        toast.error('Please log in to use wishlist');
      } else if (error.message.includes('already in wishlist')) {
        toast.info('Product is already in your wishlist');
        setIsInWishlist(true);
      } else {
        toast.error('Failed to update wishlist. Please try again.');
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image} 
          alt={name} 
          className="product-img" 
        />
        <button 
          className="add-to-cart-btn" 
          title="Add to Cart"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart />
          {isAdding && <span className="visually-hidden">Adding...</span>}
        </button>
        {/* Only show wishlist button if user is logged in */}
        {isLoggedIn && (
          <button 
            className={`wishlist-btn ${isInWishlist ? 'active' : ''} ${wishlistLoading ? 'loading' : ''}`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <div className="wishlist-spinner"></div>
            ) : (
              isInWishlist ? <FaHeart /> : <FaRegHeart />
            )}
          </button>
        )}
      </div>
      <div className="product-content">
        <h3
          className="product-title product-title-link"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/shop/product/${product.id}`)}
        >
          {name}
        </h3>
        <div className="product-price">{price}</div>
        <div className="product-rating">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>
        <div className="product-buttons">
          <button
            className="buy-now-btn"
            onClick={() => navigate(`/shop/product/${product.id}`)}
          >
            Buy Now
          </button>
          {/* Wishlist button in product buttons container */}
          {isLoggedIn && (
            <button 
              className={`wishlist-container-btn ${isInWishlist ? 'active' : ''} ${wishlistLoading ? 'loading' : ''}`}
              title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <div className="wishlist-spinner"></div>
              ) : (
                <>
                  {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                  <span>{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
