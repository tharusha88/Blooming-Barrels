import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';
import { getStoredUser, getStoredToken, clearAuth } from '../utils/jwt';

// Dashboard.jsx

import { ShoppingCart, BookOpen, FileText, Lightbulb, User, ChevronDown, Bell, Search } from 'lucide-react';
import './Profile.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('My Orders');

  const orders = [
    {
      id: 'BB-2024-1001',
      date: '2024-07-20',
      items: 3,
      total: '$59.99',
      status: 'Delivered',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'BB-2024-1002',
      date: '2024-07-18',
      items: 1,
      total: '$24.50',
      status: 'Processing',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'BB-2024-1003',
      date: '2024-07-15',
      items: 2,
      total: '$12.00',
      status: 'Delivered',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'BB-2024-1004',
      date: '2024-07-10',
      items: 1,
      total: '$35.00',
      status: 'Cancelled',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'BB-2024-1005',
      date: '2024-07-05',
      items: 4,
      total: '$89.99',
      status: 'Delivered',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'BB-2024-1006',
      date: '2024-07-01',
      items: 2,
      total: '$45.75',
      status: 'Delivered',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=80&h=80&fit=crop&crop=center'
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Processing':
        return 'status-processing';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-delivered';
    }
  };

  return (
    <div className="dashboard">
      

      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-item">
            <NavLink to="/account-overview" className="sidebar-link">
              <span>Account Overview</span>
            </NavLink>
          </div>
          
          <div className="sidebar-item">
            <a href="#" className="sidebar-link">
              <BookOpen size={16} />
              <span>My Orders</span>
            </a>
          </div>
          
          <div className="sidebar-item">
            <a href="#" className="sidebar-link">
              <FileText size={16} />
              <span>Account Settings</span>
            </a>
          </div>
          
         <div className="submenu">
            <div 
              className={`submenu-item ${activeSection === 'My Orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('My Orders')}
            >
              <span>My Orders</span>
            </div>
            
            <div 
              className={`submenu-item ${activeSection === 'My Feedback' ? 'active' : ''}`}
              onClick={() => setActiveSection('My Feedback')}
            >
              <span>My Feedback</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h1 className="welcome-title">
            Welcome Back, Alex Gardner!
          </h1>
          <p className="welcome-subtitle">
            Here's a quick overview of your activities.
          </p>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">
                Total Orders
              </div>
              <div className="stat-value">
                12
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">
                Items Purchased
              </div>
              <div className="stat-value">
                38
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">
                Feedback Submitted
              </div>
              <div className="stat-value">
                5
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">
                Points Earned
              </div>
              <div className="stat-value">
                750
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="orders-container">
            <div className="orders-header">
              <h2 className="orders-title">
                Your Recent Orders
              </h2>
            </div>
            
            <div className="orders-list">
              {orders.map((order, index) => (
                <div key={order.id} className="order-item">
                  <img 
                    src={order.image}
                    alt="Order"
                    className="order-image"
                  />
                  
                  <div className="order-details">
                    <div className="order-id">
                      Order #{order.id}
                    </div>
                    <div className="order-date">
                      Date: {order.date}
                    </div>
                    <div className="order-items">
                      Items: {order.items}
                    </div>
                    <div className="order-total">
                      Total: {order.total}
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    
                    <button className="btn-secondary">
                      View Details
                    </button>
                    
                    {order.status === 'Delivered' && (
                      <button className="btn-small">
                        Write Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          
          
        </main>
      </div>
    </div>
  );
};

export default Dashboard;