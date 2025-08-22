import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

// Fallback products when backend is not available
const fallbackProducts = [
  {
    id: 1,
    name: "Terracotta Herb Pot",
    price: "Rs 2500",
    image: "/images/terracotta.jpg",
  },
  {
    id: 2,
    name: "Custom Succulent Planter",
    price: "Rs 1800",
    image: "/images/succulent.jpg",
  },
  {
    id: 3,
    name: "Classic Ceramic Pot",
    price: "Rs 2200",
    image: "/images/ceramic.jpg",
  },
  {
    id: 4,
    name: "Hanging Macrame Planter",
    price: "Rs 1500",
    image: "/images/macrame.jpg",
  },
  {
    id: 5,
    name: "Bamboo Plant Stand",
    price: "Rs 3200",
    image: "/images/bamboo.jpg",
  },
  {
    id: 6,
    name: "Self-Watering Pot",
    price: "Rs 2700",
    image: "/images/selfwatering.jpg",
  },
  {
    id: 7,
    name: "Minimalist Concrete Planter",
    price: "Rs 2100",
    image: "/images/concrete.jpg",
  },
  {
    id: 8,
    name: "Decorative Glazed Pot",
    price: "Rs 2600",
    image: "/images/glazed.jpg",
  },
];

const ProductGrid = ({ onAddToCart }) => {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_BASE = window.location.hostname === 'localhost' 
          ? 'http://localhost:8080'  
          : '';
          
        const endpoints = [
          `${API_BASE}/api/products_with_images.php`,
          `${API_BASE}/api/products.php`,
          `${API_BASE}/api/products_simple.php`,
          `${API_BASE}/api/products_real.php`
        ];
        
        let productData = null;
        
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint);
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.products && data.products.length > 0) {
                productData = data.products;
                break;
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch from ${endpoint}:`, err.message);
          }
        }
        
        if (productData) {
          setProducts(productData);
          setUsingFallback(false);
        } else {
          console.log('Backend not available, using fallback products');
          setProducts(fallbackProducts);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts(fallbackProducts);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="product-grid-loading">
        <div className="loading-spinner">Loading products...</div>
      </div>
    );
  }
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          name={product.name}
          price={product.price}
          image={product.image}
          product={product}
          onCustomize={() => console.log("Customize", product.name)}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
