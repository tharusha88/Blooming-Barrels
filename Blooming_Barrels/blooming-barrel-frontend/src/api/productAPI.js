// src/api/productAPI.js
export const fetchProducts = async (page = 1) => {
  const response = await fetch(`/api/products?page=${page}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data;
};
