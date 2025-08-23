import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart } from '../utils/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    const res = await getCart();
    if (res.success) {
      setCart(res.cart.items || []);
      setCartCount((res.cart.items && res.cart.items.length) || 0);
    } else {
      setCart([]);
      setCartCount(0);
    }
    setLoading(false);
  };

  // Expose cart, count, and a way to refresh
  return (
    <CartContext.Provider value={{ cart, cartCount, setCart, setCartCount, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
