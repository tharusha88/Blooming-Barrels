import React, { useState, useEffect } from 'react';
import { FaEye, FaUsers, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminCard from './AdminCard';
import StatCard from './StatCard';
import LoadingSpinner from './LoadingSpinner';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 0,
    activeUsers: 0,
    conversionRate: 0,
    totalProducts: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock analytics data
      setTimeout(() => {
        setAnalyticsData({
          pageViews: 3840,
          activeUsers: 256,
          conversionRate: 12.5,
          totalProducts: 178
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      toast.error('Error loading analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="analytics">
      <AdminCard title="Analytics Dashboard">
        <p>Real-time analytics and metrics for your platform.</p>
        
        <div className="stats-grid">
          <StatCard
            title="Page Views"
            value={analyticsData.pageViews.toLocaleString()}
            icon={FaEye}
            color="#2196F3"
            growth="+8% from last week"
          />
          <StatCard
            title="Active Users"
            value={analyticsData.activeUsers.toLocaleString()}
            icon={FaUsers}
            color="#4CAF50"
            growth="+12% from last week"
          />
          <StatCard
            title="Conversion Rate"
            value={`${analyticsData.conversionRate}%`}
            icon={FaShoppingCart}
            color="#FF9800"
            growth="+0.5% from last week"
          />
          <StatCard
            title="Total Products"
            value={analyticsData.totalProducts.toLocaleString()}
            icon={FaChartLine}
            color="#9C27B0"
            growth="+5% from last week"
          />
        </div>
      </AdminCard>
    </div>
  );
};

export default Analytics;
