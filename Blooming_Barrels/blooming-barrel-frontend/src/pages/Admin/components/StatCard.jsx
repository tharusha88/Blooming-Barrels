import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, color = '#2196F3', change, className = '', ...props }) => {
  return (
    <div className={`stat-card ${className}`} style={{ borderColor: color }} {...props}>
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ color }}>
          {Icon && <Icon />}
        </div>
        <div className="stat-card-info">
          <h4 className="stat-card-title">{title}</h4>
          <div className="stat-card-value">{value}</div>
        </div>
      </div>
      {change && (
        <div className="stat-card-change">
          <span className="change-text">{change}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
