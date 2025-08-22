import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { 
  FaUsers, 
  FaBoxes, 
  FaCog, 
  FaChartBar, 
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('blooming_barrels_token');
        const userDataStr = localStorage.getItem('blooming_barrels_user');
        
        if (!token || !userDataStr) {
          console.log('No token or user data found');
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Parse stored user data
        const userData = JSON.parse(userDataStr);
        console.log('Stored user data:', userData);
        console.log('User role:', userData.role);
        
        // Check if user has admin role
        const userRole = typeof userData.role === 'object' ? userData.role.name : userData.role;
        console.log('User role name:', userRole);
        
        if (userRole === 'admin' || userRole === 'administrator' || 
            (typeof userData.role === 'object' && userData.role.id === 3)) {
          console.log('User has admin privileges');
          setIsAdmin(true);
        } else {
          console.log('User does not have admin privileges, role:', userData.role);
          setIsAdmin(false);
          toast.error('Access denied. Admin privileges required.');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
        toast.error('Authentication error. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('blooming_barrels_token');
    localStorage.removeItem('blooming_barrels_user');
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Overview', exact: true },
    { path: '/admin/users', icon: FaUsers, label: 'User Management' },
    { path: '/admin/roles', icon: FaUserShield, label: 'Role Management' },
    { path: '/admin/products', icon: FaBoxes, label: 'Product Management' },
    { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/admin/settings', icon: FaCog, label: 'System Settings' },
    { path: '/admin/data', icon: FaDatabase, label: 'Data Management' },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </Link>
            );
          })}
          
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="admin-header">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>Blooming Barrels Admin</h1>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
