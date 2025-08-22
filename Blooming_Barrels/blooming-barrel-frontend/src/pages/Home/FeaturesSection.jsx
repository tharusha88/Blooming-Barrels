import React from "react";
import { FaShoppingCart, FaBookOpen, FaFileAlt, FaCamera, FaArrowRight, FaWrench } from "react-icons/fa";
import './FeaturesSection.css';
import { Leaf, Sun, Flower2 } from 'lucide-react';

const features = [
  {
    icon: <FaShoppingCart />, color: 'icon-bg-green',
    title: "Premium Plant Shop",
    desc: "Curated selection of plants, seeds, pots, and tools. Filter by color, size, and growing conditions.",
    link: "#shop"
  },
  {
    icon: <FaBookOpen />, color: 'icon-bg-green',
    title: "Expert Learning Hub",
    desc: "Professional guides, seasonal tips, and gardening wisdom from certified horticulturists.",
    link: "#learning"
  },
  {
    icon: <FaFileAlt />, color: 'icon-bg-red',
    title: "Design Templates",
    desc: "Download professionally designed garden layouts as PDFs for any space size.",
    link: "#templates"
  },
  {
    icon: <FaCamera />, color: 'icon-bg-green',
    title: "AI Garden Planner",
    desc: "Upload a photo of your space and get personalized garden designs powered by AI.",
    link: "#planner"
  },
  {
    icon: <FaWrench />, color: 'icon-bg-green',
    title: "Full-Service Installation",
    desc: "Professional garden installation and ongoing maintenance by our expert team.",
    link: "#installation"
  }
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">Everything for Your Garden Journey</h2>
        <p className="features-subtitle">From planning to planting, we provide comprehensive solutions for garden enthusiasts at every level.</p>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className={`feature-icon-bg ${feature.color}`}>
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <a href={feature.link} className="feature-link">
                Learn More <FaArrowRight className="feature-link-arrow" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
