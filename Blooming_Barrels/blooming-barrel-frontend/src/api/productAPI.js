// src/api/productAPI.js
export const fetchProducts = async (page = 1) => {
  const response = await fetch(`/api/products?page=${page}`);
  const data = await response.json();
  return data;
};
