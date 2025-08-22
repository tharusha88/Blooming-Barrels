import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import HeroCarousel from '../HeroCarousel';
import './ShopHero.css';
import { LuChevronRight, LuChevronLeft } from "react-icons/lu";

const heroSlides = [
  { image: '/images/hero-banner1.png', alt: 'Garden Collection' },
  { image: '/images/hero-banner2.png', alt: 'Plant Care Essentials' },
  { image: '/images/hero-banner3.png', alt: 'Premium Planters' },
  { image: '/images/hero-banner4.png', alt: 'Plant Paradise' },
  { image: '/images/hero-banner1.png', alt: 'Garden Essentials' },
  { image: '/images/hero-banner.png', alt: 'Eco-Friendly Planters' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
};

export const Cactus = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8v6a2 2 0 0 0 2 2h2m6-2h2a2 2 0 0 0 2-2V6M9 22V5a3 3 0 1 1 6 0v17m-8 0h10"></path>
  </svg>
);

import { FiShoppingCart } from 'react-icons/fi';

const ShopHero = ({ cartCount = 0, onCartClick }) => {
  const carouselRef = useRef(null);

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.goToNext();
    }
  };

  const goToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.goToPrevious();
    }
  };

  return (
    <section className="shop-hero">
      <div className="hero-carousel-wrapper">
        <HeroCarousel ref={carouselRef} slides={heroSlides} interval={10000} />
      </div>
      <button className="carousel-nav-btn carousel-prev" onClick={goToPrevious}>
        <Cactus style={{ width: 60, height: 60, color: "#fff" }} />
      </button>
      <button className="carousel-nav-btn carousel-next" onClick={goToNext}>
        <Cactus style={{ width: 60, height: 60, color: "#fff" }} />
      </button>
      
      {/* Cart Button */}
      <div className="cart-button-container">
        <button className="cart-button" onClick={onCartClick}>
          <FiShoppingCart className="cart-icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <motion.h1
          className="hero-heading"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          Welcome to Blooming Barrels
        </motion.h1>
        <motion.p
          className="hero-subtext"
          initial="initial"
          animate="animate"
          variants={{ ...fadeInUp, transition: { ...fadeInUp.transition, delay: 0.2 } }}
        >
          Discover premium plants, customizable pots, and garden essentials—all tailored to elevate your space.
        </motion.p>
        <motion.button
          className="hero-btn"
          initial="initial"
          animate="animate"
          variants={{ ...fadeInUp, transition: { ...fadeInUp.transition, delay: 0.4 } }}
        >
          Explore Collection
        </motion.button>
      </div>
    </section>
  );
};

export default ShopHero;
