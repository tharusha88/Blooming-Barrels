import React from 'react';
import { BrainCircuit } from 'lucide-react';
import './HeroSection.css';

const features = [
  { icon: '🪴', text: 'Expert Plant Selection' },
  { icon: <BrainCircuit size={18} color="#e53935" />, text: 'AI Garden Planner' },
  { icon: '🛠️', text: 'Professional Installation' },
  { icon: '📚', text: 'Learning Hub' },
];

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">Your Garden</span>
            <span className="hero-title-accent">Starts Here</span>
          </h1>
          <div className="hero-subtitle">
            From expert guidance to AI-powered design, everything you need to create your perfect garden sanctuary.
          </div>
          <div className="hero-actions">
            <button className="hero-btn hero-btn-primary">
              <span className="hero-btn-icon">🛒</span>
              Start Shopping
            </button>
            <button className="hero-btn hero-btn-accent">
              <span className="hero-btn-icon">🧠</span>
              Try AI Design
            </button>
          </div>
          <div className="hero-features-row-flat">
            {features.map((feature, idx) => (
              <div className="hero-feature-pill-flat" key={idx}>
                <span className="hero-feature-icon-flat">{feature.icon}</span>
                <span className="hero-feature-text-flat">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
