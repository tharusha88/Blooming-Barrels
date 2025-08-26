/*  GardenExpertDashboard.jsx
    Same logic, new modern UI.
*/
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, clearAuth } from '../utils/jwt';
import './GardenExpertDashboard.css';

/* ---------- Re-usable primitives ---------- */
const MetricCard = ({ label, value, accent, onClick, clickable = false }) => {
  const accentClass = accent === '#166534' ? 'accent-green'
                    : accent === '#b45309' ? 'accent-orange'
                    : accent === '#1d4ed8' ? 'accent-blue'
                    : accent === '#7c3aed' ? 'accent-purple' : '';
  return (
    <button
      className={`metric-card ${clickable ? 'clickable' : ''} ${accentClass}`}
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
    >
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </button>
  );
};


const SectionCard = ({ title, action, children }) => (
  <section className="section-card">
    <header className="section-header">
      <h3>{title}</h3>
      {action && <div className="section-action">{action}</div>}
    </header>
    <div className="section-body">{children}</div>
  </section>
);

/* ---------- Main component ---------- */
export default function GardenExpertDashboard() {
  const [articleCategories, setArticleCategories] = useState([]);
  useEffect(() => {
    fetch('/api/article_categories', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setArticleCategories(data))
      .catch(err => console.error(err));
  }, []);
  const user = getStoredUser();
  const navigate = useNavigate();
  const [cartCount] = useState(0);
  const [analytics, setAnalytics]   = useState(null);
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [articleComments, setArticleComments]     = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText]   = useState('');

  // --- data loading ---
  const loadData = useCallback(async () => {
    setError(null);
    setRefreshing(true);
    try {
  const res = await fetch('/api/articles', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load articles');
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        try {
          data = JSON.parse(await res.text());
        } catch (err) {
          throw new Error('API did not return valid JSON.');
        }
      }

      if (Array.isArray(data)) {
        setArticles(data);
        const analyticsData = {
          summary: {
            total: data.length,
            published: data.filter(a => a.status === 'published').length,
            drafts: data.filter(a => a.status !== 'published').length,
            total_views: data.reduce((sum, a) => sum + (a.views_count || 0), 0),
            avg_rating: (
              data.reduce((sum, a) => sum + (a.rating_average || 0), 0) /
              (data.filter(a => a.rating_average).length || 1)
            ),
          },
          top: data.filter(a => a.status === 'published'),
        };
        setAnalytics(analyticsData);
      } else {
        throw new Error('API did not return an array of articles.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePublish = async (articleId) => {
    try {
      const res = await fetch(`/api/articles/${articleId}/publish`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to publish article');
      setArticles(prev => prev.map(article =>
        article.id === articleId
          ? { ...article, status: 'published' }
          : article
      ));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (articleId) => navigate(`/garden-expert/articles/${articleId}/edit`);
  const handleLogout = () => { clearAuth(); navigate('/'); };
  const handleMetricClick = (metricType) => {
    if (metricType === 'published') {
      setActiveView('published');
      loadPublishedArticles();
    } else setActiveView('overview');
  };

  const loadPublishedArticles = async () => {
    try {
      const published = articles.filter(a => a.status === 'published');
      setPublishedArticles(published);
      const commentsData = {};
      for (let article of published) {
        const res = await fetch(`/api/articles/${article.id}/comments`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        commentsData[article.id] = res.ok ? await res.json() : [];
      }
      setArticleComments(commentsData);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleReplySubmit = async (articleId, parentId) => {
    if (!replyText.trim()) return;
    try {
      const newReply = {
        id: Date.now(),
        content: replyText,
        author: 'You',
        created_at: new Date().toISOString()
      };
      setArticleComments(prev => ({
        ...prev,
        [articleId]: [...(prev[articleId] || []), newReply]
      }));
      setReplyText('');
      setReplyingTo(null);
    } catch (e) { setError(e.message); }
  };

  const drafts = articles.filter(a => a.status !== 'published');
  const published = articles.filter(a => a.status === 'published');

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-content">
        {/* ---- Header ---- */}
        <header className="app-header flex flex-between mb-md">
          <div className="header-left">
            <h1 className="brand">🌱 Garden Expert</h1>
            <p className="subtitle">Author, refine & analyse your horticultural articles</p>
          </div>
          <div className="header-right">
            <div className="user-chip">
              <span className="name">{user?.username || 'Garden Expert'}</span>
              <span className="role">{user?.role_name || 'Expert'}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* ---- Actions ---- */}
        <div className="toolbar flex flex-between mb-md">
          <div>
            <button className="btn btn-primary" onClick={() => navigate('/garden-expert/articles/new')}>
              + New Article
            </button>
            <button className="btn btn-secondary ml-md" onClick={loadData} disabled={refreshing}>
              Refresh
            </button>
          </div>
          <div className="nav-tabs">
            <button className={`tab ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}>Overview</button>
            <button className={`tab ${activeView === 'published' ? 'active' : ''}`} onClick={() => setActiveView('published')}>Published</button>
          </div>
        </div>

        {/* ---- Metrics ---- */}
        {analytics && (
          <section className="metrics grid-auto mb-md">
            <MetricCard label="Total Articles" value={analytics.summary.total} clickable onClick={() => handleMetricClick('total')} />
            <MetricCard label="Published" value={analytics.summary.published} accent="#166534" clickable onClick={() => handleMetricClick('published')} />
            <MetricCard label="Drafts" value={analytics.summary.drafts} accent="#b45309" clickable onClick={() => handleMetricClick('drafts')} />
            <MetricCard label="Total Views" value={analytics.summary.total_views} accent="#1d4ed8" clickable onClick={() => handleMetricClick('views')} />
            <MetricCard label="Avg Rating" value={Number(analytics.summary.avg_rating).toFixed(2)} accent="#7c3aed" clickable onClick={() => handleMetricClick('rating')} />
          </section>
        )}

        {loading && !analytics && <p className="loading">Loading metrics…</p>}
        {error && <p className="error">Error: {error}</p>}

        {/* ---- Content ---- */}
        {activeView === 'overview' && (
          <div className="overview grid-auto gap-md">
            <SectionCard title="Drafts" action={drafts.length > 0 && <span className="pill">{drafts.length}</span>}>
              {drafts.length ? (
                <ul className="list">
                  {drafts.slice(0, 6).map(d => <ArticleListItem key={d.id} a={d} onPublish={handlePublish} onEdit={handleEdit} />)}
                </ul>
              ) : <EmptyState text="No drafts – start a new article." />}
            </SectionCard>

            <SectionCard title="Recently Published" action={published.length > 0 && <span className="pill">{published.length}</span>}>
              {published.length ? (
                <ul className="list">
                  {published.slice(0, 6).map(p => <ArticleListItem key={p.id} a={p} onEdit={handleEdit} />)}
                </ul>
              ) : <EmptyState text="Nothing published yet." />}
            </SectionCard>

            <SectionCard title="Top Viewed" action={analytics?.top?.length > 0 && <span className="pill">{analytics.top.length}</span>}>
              {analytics?.top?.length ? (
                <ul className="list">
                  {analytics.top.slice(0, 6).map(t => <ArticleListItem key={t.id} a={t} showViews showRating />)}
                </ul>
              ) : <EmptyState text="No view data yet." />}
            </SectionCard>
          </div>
        )}

        {activeView === 'published' && (
          <div className="published-view">
            <h2 className="page-title">Published Articles & Comments</h2>
            {published.length ? (
              published.map(article => (
                <section key={article.id} className="article-card">
                  <header>
                    <h3>{article.title}</h3>
                    <div className="meta">
                      <span>👁 {article.views_count || 0} views</span>
                      <span>⭐ {article.rating_average || 0} ({article.rating_count || 0} ratings)</span>
                      <span>📅 {new Date(article.created_at).toLocaleDateString()}</span>
                      <button className="icon ml-md" title="Edit" onClick={() => handleEdit(article.id)}>✏️ Edit</button>
                    </div>
                  </header>
                  <div className="comments">
                    <h4>Comments ({articleComments[article.id]?.length || 0})</h4>
                    {articleComments[article.id]?.length ? (
                      articleComments[article.id].map(c => (
                        <div key={c.id} className="comment">
                          <div className="comment-header">
                            <span className="author">{c.author_name}</span>
                            <span className="date">{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                          <p>{c.content}</p>
                          <button className="reply-link" onClick={() => { setReplyingTo(c.id); setReplyText(''); }}>Reply</button>
                          {replyingTo === c.id && (
                            <div className="reply-box">
                              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply…" />
                              <div className="reply-actions">
                                <button className="btn-primary small" onClick={() => handleReplySubmit(article.id, c.id)}>Post</button>
                                <button className="btn-outline small" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : <p className="empty">No comments yet.</p>}
                  </div>
                </section>
              ))
            ) : <EmptyState text="No published articles yet." />}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- helpers (unchanged) --- */
const ArticleListItem = ({ a, showViews, showRating, onPublish, onEdit }) => (
  <li className="list-item">
    <div className="item-content">
      <p className="title">{a.title || 'Untitled'}</p>
      <span className={`badge ${a.status}`}>{a.status}</span>
    </div>
    <div className="item-meta">
      {showViews && <span>👁 {a.views_count ?? 0}</span>}
      {showRating && <span>⭐ {a.rating_average ?? 0} ({a.rating_count ?? 0})</span>}
      {a.updated_at && <span>{new Date(a.updated_at).toLocaleDateString()}</span>}
    </div>
    <div className="item-actions">
      {onEdit && <button className="icon" title="Edit" onClick={() => onEdit(a.id)}>✏️</button>}
      {a.status === 'draft' && onPublish && <button className="icon" title="Publish" onClick={() => onPublish(a.id)}>🚀</button>}
    </div>
  </li>
);

const EmptyState = ({ text }) => <p className="empty-state">{text}</p>;
