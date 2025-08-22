import React from "react";
import { FaUsers, FaLeaf, FaMedal, FaStar } from "react-icons/fa";
import "./StatsSection.css";

const stats = [
  {
    icon: <FaUsers />,
    value: "12,000+",
    label: "Happy Gardeners",
    subtitle: "Customers served nationwide"
  },
  {
    icon: <FaLeaf />,
    value: "500+",
    label: "Plant Varieties",
    subtitle: "Carefully curated selection"
  },
  {
    icon: <FaMedal />,
    value: "98%",
    label: "Success Rate",
    subtitle: "Plants thriving after 30 days"
  },
  {
    icon: <FaStar />,
    value: "4.9",
    label: "Customer Rating",
    subtitle: "Based on 2,847 reviews",
    isStar: true
  }
];

const StatsSection = () => (
  <section className="stats-section">
    <div className="stats-container">
      {stats.map((stat, idx) => (
        <div className="stat-card" key={idx}>
          <div className="stat-icon-bg">
            <span className="stat-icon">{stat.icon}</span>
          </div>
          <div className="stat-value-row">
            <span className="stat-value">{stat.value}</span>
            {stat.isStar && <FaStar className="stat-star" />}
          </div>
          <div className="stat-label">{stat.label}</div>
          <div className="stat-subtitle">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
