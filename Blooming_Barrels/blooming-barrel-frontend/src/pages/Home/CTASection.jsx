import React from "react";
import { FaCamera } from "react-icons/fa";
import { Store } from "lucide-react";
import "./CTASection.css";

const CTASection = () => (
  <section className="cta-section">
    <div className="cta-bg-circle cta-bg-circle-1"></div>
    <div className="cta-bg-circle cta-bg-circle-2"></div>
    <div className="cta-content">
      <h2 className="cta-title">Ready to Transform Your Space?</h2>
      <p className="cta-subtitle">
        Upload a photo of your garden space and get personalized AI-powered design<br />
        recommendations in minutes. Start your garden transformation today.
      </p>
      <div className="cta-btn-row">
        <a href="#ai-tool" className="cta-btn cta-btn-primary cta-btn-primary-small">
          <FaCamera className="cta-btn-icon" /> Try AI Design Tool
        </a>
        <a href="/shop" className="cta-btn cta-btn-secondary cta-btn-primary-small">
          <Store className="cta-btn-icon" size={16} /> Browse Plant Shop
        </a>
      </div>
      <div className="cta-note">
        No signup required &bull; Free design consultation &bull; Expert recommendations
      </div>
    </div>
  </section>
);

export default CTASection; 