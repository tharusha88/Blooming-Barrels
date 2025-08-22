// src/api/cartAPI.js
export const fetchCart = async () => {
  const response = await fetch('/api/cart');
  const data = await response.json();
  return data;
};

export const removeFromCart = async (productId) => {
  const response = await fetch(`/api/cart/remove/${productId}`, { method: 'DELETE' });
  return response.json();
};
