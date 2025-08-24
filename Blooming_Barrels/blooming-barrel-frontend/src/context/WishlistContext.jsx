import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWishlist, removeFromWishlist, addToWishlist } from '../api/wishlistAPI';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlistData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWishlist();
      if (Array.isArray(res.items)) {
        setWishlist(res.items);
      } else if (Array.isArray(res)) {
        setWishlist(res);
      } else {
        setWishlist([]);
        setError('Failed to fetch wishlist');
      }
    } catch (err) {
      setError('Failed to fetch wishlist');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const addItem = async (productId) => {
    try {
      await addToWishlist(productId);
      fetchWishlistData();
    } catch (err) {
      setError('Failed to add item to wishlist');
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item.product_id !== productId));
    } catch (err) {
      setError('Failed to remove item from wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, error, fetchWishlistData, addItem, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
