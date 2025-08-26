// src/api/cartAPI.js
export const fetchCart = async () => {
  const response = await fetch('/api/cart', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch cart');
  const data = await response.json();
  return data;
};

export const removeFromCart = async (productId) => {
  const response = await fetch(`/api/cart/remove/${productId}`, { method: 'DELETE', credentials: 'include' });
  if (!response.ok) throw new Error('Failed to remove from cart');
  return response.json();
};
