import React from 'react';
import Navbar from '../components/Navigation/Navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getStoredToken, clearAuth } from '../utils/jwt';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setIsLoggedIn(true);
      if (storedUser.role_name === 'garden_expert') {
        fetchAnalytics();
      }
    }
  }, []);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    setErrorAnalytics(null);
    try {
      // Mock analytics data
      const mockAnalyticsData = {
        totalViews: 1250,
        totalLikes: 89,
        totalComments: 34,
        articlesPublished: 12
      };
      setAnalytics(mockAnalyticsData);
    } catch (e) {
      setErrorAnalytics(e.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      <Navbar 
        cartCount={cartCount}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div className="page-content" style={{ padding: '2rem', marginTop: '80px' }}>
        <h1>Team Dashboard</h1>
        <p>Collaborate with garden experts and manage your projects.</p>

        {user?.role_name === 'garden_expert' && (
          <section style={{ marginTop: '2rem' }}>
            <h2>Your Article Performance</h2>
            {loadingAnalytics && <p>Loading analytics...</p>}
            {errorAnalytics && <p style={{color:'red'}}>{errorAnalytics}</p>}
            {analytics && (
              <div style={{display:'grid', gap:'1rem', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))'}}>
                <SummaryCard title="Total Articles" value={analytics.summary.total} />
                <SummaryCard title="Published" value={analytics.summary.published} />
                <SummaryCard title="Drafts" value={analytics.summary.drafts} />
                <SummaryCard title="Total Views" value={analytics.summary.total_views} />
                <SummaryCard title="Avg Rating" value={Number(analytics.summary.avg_rating).toFixed(2)} />
              </div>
            )}
            {analytics?.top?.length > 0 && (
              <div style={{marginTop:'2rem'}}>
                <h3>Top Viewed Articles</h3>
                <ul style={{listStyle:'none', padding:0}}>
                  {analytics.top.map(a => (
                    <li key={a.id} style={{padding:'0.5rem 0', borderBottom:'1px solid #eee'}}>
                      <strong>{a.title}</strong><br/>
                      <small>Views: {a.views_count} | Rating: {a.rating_average} ({a.rating_count}) {a.status==='published' ? '✅' : '📝'}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div style={{background:'#fff', border:'1px solid #ddd', borderRadius:8, padding:'1rem', boxShadow:'0 1px 2px rgba(0,0,0,0.06)'}}>
      <div style={{fontSize:12, textTransform:'uppercase', color:'#555'}}>{title}</div>
      <div style={{fontSize:28, fontWeight:600}}>{value}</div>
    </div>
  );
}
