import React, { useState, useEffect } from 'react';
import { fetchWishlist, removeFromWishlist } from '../../api/wishlistAPI';
import { ShoppingCart, BookOpen, FileText, Lightbulb, User, ChevronDown, Bell, Search } from 'lucide-react';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('My Orders');
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch wishlist on mount
  useEffect(() => {
    setWishlistLoading(true);
    fetchWishlist()
      .then(items => setWishlist(items))
      .catch(() => setWishlist([]))
      .finally(() => setWishlistLoading(false));
  }, []);

  // Remove from wishlist handler
  const handleRemoveWishlist = async (productId) => {
    setWishlistLoading(true);
    try {
      await removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => (item.product_id || item.id) !== productId));
    } catch (e) {
      alert('Failed to remove from wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#28a745';
      case 'Processing':
        return '#007bff';
      case 'Cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#28a745',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              🌱
            </div>
            <span style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>
              Blooming Barrels
            </span>
          </div>
          
          <nav style={{ display: 'flex', gap: '24px' }}>
            {['Home', 'Shop', 'Learn', 'Templates', 'Team'].map(item => (
              <a key={item} href="#" style={{
                color: '#6c757d',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {item}
              </a>
            ))}
          </nav>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6c757d',
            cursor: 'pointer'
          }}>
            Sign Up
          </button>
          <button style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Log In
          </button>
          <ShoppingCart size={20} color="#6c757d" />
          <Bell size={20} color="#6c757d" />
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#e9ecef',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={16} color="#6c757d" />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px',
          backgroundColor: 'white',
          minHeight: 'calc(100vh - 61px)',
          borderRight: '1px solid #e9ecef',
          padding: '24px 0'
        }}>
          <div style={{ padding: '0 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={16} color="#6c757d" />
              <span style={{ color: '#6c757d', fontSize: '14px' }}>Shop</span>
            </div>
          </div>
          
          <div style={{ padding: '0 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#6c757d" />
              <span style={{ color: '#6c757d', fontSize: '14px' }}>Learning Hub</span>
            </div>
          </div>
          
          <div style={{ padding: '0 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#6c757d" />
              <span style={{ color: '#6c757d', fontSize: '14px' }}>Templates</span>
            </div>
          </div>
          
          <div style={{ padding: '0 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={16} color="#6c757d" />
              <span style={{ color: '#6c757d', fontSize: '14px' }}>AI Suggestion</span>
            </div>
          </div>
          
          <div style={{ padding: '0 24px', marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#28a745" />
                <span style={{ color: '#28a745', fontSize: '14px', fontWeight: '500' }}>User Dashboard</span>
              </div>
              <ChevronDown size={14} color="#28a745" />
            </div>
          </div>
          
          <div style={{ padding: '0 32px' }}>
            <div 
              style={{ 
                padding: '8px 16px',
                backgroundColor: activeSection === 'My Orders' ? '#e8f5e8' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
              onClick={() => setActiveSection('My Orders')}
            >
              <span style={{ 
                color: activeSection === 'My Orders' ? '#28a745' : '#6c757d', 
                fontSize: '14px',
                fontWeight: activeSection === 'My Orders' ? '500' : '400'
              }}>
                My Orders
              </span>
            </div>
            
            <div 
              style={{ 
                padding: '8px 16px',
                backgroundColor: activeSection === 'My Feedback' ? '#e8f5e8' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveSection('My Feedback')}
            >
              <span style={{ 
                color: activeSection === 'My Feedback' ? '#28a745' : '#6c757d', 
                fontSize: '14px',
                fontWeight: activeSection === 'My Feedback' ? '500' : '400'
              }}>
                My Feedback
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px 40px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '600', 
            color: '#333',
            marginBottom: '8px'
          }}>
            Welcome Back, Alex Gardner!
          </h1>
          <p style={{ 
            color: '#6c757d', 
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Here's a quick overview of your activities.
          </p>

          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '8px' }}>
                Total Orders
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#28a745' }}>
                12
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '8px' }}>
                Items Purchased
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#28a745' }}>
                38
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '8px' }}>
                Feedback Submitted
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#28a745' }}>
                5
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '8px' }}>
                Points Earned
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#28a745' }}>
                750
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#333',
                margin: 0
              }}>
                Your Recent Orders
              </h2>
            </div>
            
            <div style={{ padding: '0' }}>
              {orders.map((order, index) => (
                <div key={order.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 32px',
                  borderBottom: index < orders.length - 1 ? '1px solid #f8f9fa' : 'none'
                }}>
                  <img 
                    src={order.image}
                    alt="Order"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      marginRight: '16px'
                    }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#333',
                      marginBottom: '4px'
                    }}>
                      Order #{order.id}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6c757d',
                      marginBottom: '2px'
                    }}>
                      Date: {order.date}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6c757d',
                      marginBottom: '4px'
                    }}>
                      Items: {order.items}
                    </div>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#28a745'
                    }}>
                      Total: {order.total}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {order.status}
                    </span>
                    
                    <button style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #e9ecef',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#6c757d',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}>
                      View Details
                    </button>
                    
                    {order.status === 'Delivered' && (
                      <button style={{
                        backgroundColor: '#28a745',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: 'white',
                        cursor: 'pointer'
                      }}>
                        Write Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* My Wishlist Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginTop: '40px',
            marginBottom: '40px'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                margin: 0
              }}>
                My Wishlist
              </h2>
            </div>
            <div style={{ padding: '0' }}>
              {wishlistLoading ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>Loading wishlist...</div>
              ) : wishlist.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#6c757d' }}>No items in your wishlist.</div>
              ) : wishlist.map((item, idx) => (
                <div key={item.product_id || item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 32px',
                  borderBottom: idx < wishlist.length - 1 ? '1px solid #f8f9fa' : 'none'
                }}>
                  <img
                    src={item.image_url || (item.images && item.images[0]?.url) || '/images/placeholder.png'}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      marginRight: '16px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '2px' }}>Price: Rs {item.price}</div>
                  </div>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleRemoveWishlist(item.product_id || item.id)}
                    disabled={wishlistLoading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '20px',
            color: '#6c757d',
            fontSize: '14px'
          }}>
            Made with ❤️ <strong>Visily</strong>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;