// src/api/wishlistAPI.js

// Fetch the current user's wishlist
export const fetchWishlist = async () => {
  const response = await fetch('/api/wishlist', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch wishlist');
  return response.json();
};

// Add a product to the wishlist
export const addToWishlist = async (productId) => {
  const response = await fetch('/api/wishlist', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId })
  });
  if (!response.ok) throw new Error('Failed to add to wishlist');
  return response.json();
};

// Remove a product from the wishlist
export const removeFromWishlist = async (productId) => {
  const response = await fetch(`/api/wishlist/${productId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to remove from wishlist');
  return response.json();
};
