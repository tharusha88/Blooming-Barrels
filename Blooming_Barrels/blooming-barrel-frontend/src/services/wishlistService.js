// src/services/wishlistService.js
// Basic localStorage-based wishlist service for demo purposes

const WISHLIST_KEY = 'wishlist';

export function getWishlist() {
  const data = localStorage.getItem(WISHLIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToWishlist(product) {
  const wishlist = getWishlist();
  if (!wishlist.find(item => item.id === product.id)) {
    wishlist.push(product);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
}

export function removeFromWishlist(productId) {
  const wishlist = getWishlist().filter(item => item.id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}


// Unified authentication check: use the same keys as the rest of the app
export function isAuthenticated() {
  return !!localStorage.getItem('blooming_barrels_user') || !!localStorage.getItem('blooming_barrels_token');
}

// Check if a product is in the wishlist
export function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
}

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isAuthenticated,
  isInWishlist
};
