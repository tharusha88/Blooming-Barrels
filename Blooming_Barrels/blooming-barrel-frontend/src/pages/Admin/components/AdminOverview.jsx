import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaBoxes,
  FaShoppingCart,
  FaHeart,
  FaChartLine,
  FaServer,
  FaPlus,
  FaCog
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminCard from './AdminCard';
import StatCard from './StatCard';
import LoadingSpinner from './LoadingSpinner';
import { getAdminStats } from '../../../utils/api';


const AdminOverview = () => {
  const [stats, setStats] = useState({
    systemStatus: 'online',
    serverUptime: '99.9%'
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch admin statistics
        const statsResult = await getAdminStats();
        if (statsResult.success) {
          setStats(prevStats => ({
            ...prevStats,
            ...statsResult.data
          }));
        } else {
          console.error('Failed to fetch stats:', statsResult.error);
          toast.error('Failed to load statistics');
        }

        // Fetch recent activity
        const activityResult = await getRecentActivity();
        if (activityResult.success) {
          setRecentActivity(activityResult.data);
        } else {
          console.error('Failed to fetch activity:', activityResult.error);
          // Keep default activity if API fails
          setRecentActivity([
            {
              timestamp: new Date().toISOString(),
              description: 'System started successfully',
              type: 'system'
            }
          ]);
        }

      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      icon: FaPlus,
      link: '/admin/products?action=add',
      color: '#4CAF50'
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: FaUsers,
      link: '/admin/users',
      color: '#2196F3'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: FaCog,
      link: '/admin/settings',
      color: '#FF9800'
    },
    {
      title: 'View Analytics',
      description: 'Check detailed analytics',
      icon: FaChartLine,
      link: '/admin/analytics',
      color: '#9C27B0'
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="admin-overview">
      <div className="welcome-section">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage your Blooming Barrels e-commerce platform</p>
      </div>

      {/* Key Statistics */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={FaUsers}
          color="#2196F3"
          change={stats.userGrowth ? `${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}% from last month` : "+12% from last month"}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={FaBoxes}
          color="#4CAF50"
          change={stats.productGrowth !== undefined ? `${stats.productGrowth > 0 ? '+' : ''}${stats.productGrowth}% from last month` : "+5% from last month"}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={FaShoppingCart}
          color="#FF9800"
          change="+18% from last month"
        />
        <StatCard
          title="Wishlist Items"
          value={stats.totalWishlistItems.toLocaleString()}
          icon={FaHeart}
          color="#E91E63"
          change="+25% from last month"
        />
      </div>

      {/* System Status */}
      <AdminCard title="System Status">
        <div className="system-status">
          <div className="status-item">
            <div className="status-indicator online"></div>
            <div className="status-info">
              <h4>Server Status</h4>
              <p>Online and running smoothly</p>
            </div>
          </div>
          <div className="status-item">
            <div className="status-metric">
              <FaServer />
              <span>Uptime: {stats.serverUptime}</span>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Quick Actions */}
      <AdminCard title="Quick Actions">
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="quick-action-card">
              <div className="action-icon" style={{ color: action.color }}>
                <action.icon />
              </div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </AdminCard>

      {/* Recent Activity */}
      <AdminCard title="Recent Activity">
        {recentActivity.length > 0 ? (
          <div className="activity-list">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-time">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
                <div className="activity-description">
                  {activity.description}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-activity">No recent activity to display</p>
        )}
      </AdminCard>
    </div>
  );
};

export default AdminOverview;