import React from 'react';
import './AdminCard.css';

const AdminCard = ({ title, children, className = '', ...props }) => {
  return (
    <div className={`admin-card ${className}`} {...props}>
      {title && (
        <div className="admin-card-header">
          <h3 className="admin-card-title">{title}</h3>
        </div>
      )}
      <div className="admin-card-content">
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
