import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, clearAuth } from '../utils/jwt';
import './gardenExpertDashboard.css';

/* ---------- Re-usable primitives ---------- */
const MetricCard = ({ label, value, accent, onClick, clickable = false }) => {
  const accentClass = accent === '#166534' ? 'metric-card--green'
                    : accent === '#b45309' ? 'metric-card--orange'
                    : accent === '#1d4ed8' ? 'metric-card--blue'
                    : accent === '#7c3aed' ? 'metric-card--purple' : '';
  return (
    <button
      className={`metric-card ${clickable ? 'metric-card--clickable' : ''} ${accentClass}`}
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      aria-label={`${label}: ${value}`}
    >
      <span className="metric-card__label">{label}</span>
      <span className="metric-card__value">{value}</span>
    </button>
  );
};

const SectionCard = ({ title, action, children }) => (
  <section className="section-card" aria-labelledby={`section-${title.toLowerCase().replace(/\s/g, '-')}`}>
    <header className="section-card__header">
      <h3 id={`section-${title.toLowerCase().replace(/\s/g, '-')}`}>{title}</h3>
      {action && <div className="section-card__action">{action}</div>}
    </header>
    <div className="section-card__body">{children}</div>
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
  const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: replyText,
          parent_id: parentId
        })
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Failed to post reply');
      }
      // Refresh comments for this article
      const commentsRes = await fetch(`/api/articles/${articleId}/comments`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedComments = commentsRes.ok ? await commentsRes.json() : [];
      setArticleComments(prev => ({ ...prev, [articleId]: updatedComments }));
      setReplyText('');
      setReplyingTo(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const drafts = articles.filter(a => a.status !== 'published');
  const published = articles.filter(a => a.status === 'published');

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        {/* ---- Header ---- */}
        <header className="dashboard__header">
          <div className="dashboard__header-left">
            <h1 className="dashboard__brand">🌱 Garden Expert</h1>
            <p className="dashboard__subtitle">Author, refine & analyse your horticultural articles</p>
          </div>
          <div className="dashboard__header-right">
            <div className="user-chip" role="group" aria-label="User information">
              <span className="user-chip__name">{user?.username || 'Garden Expert'}</span>
              <span className="user-chip__role">{user?.role_name || 'Expert'}</span>
            </div>
            <button className="btn btn--logout" onClick={handleLogout} aria-label="Log out">Logout</button>
          </div>
        </header>

        {/* ---- Actions ---- */}
        <div className="dashboard__toolbar">
          <div className="toolbar__actions">
            <button className="btn btn--primary" onClick={() => navigate('/garden-expert/articles/new')} aria-label="Create new article">
              + New Article
            </button>
            <button className="btn btn--secondary" onClick={loadData} disabled={refreshing} aria-label="Refresh dashboard data">
              Refresh
            </button>
          </div>
          <nav className="toolbar__nav" role="tablist">
            <button
              className={`nav-tab ${activeView === 'overview' ? 'nav-tab--active' : ''}`}
              onClick={() => setActiveView('overview')}
              role="tab"
              aria-selected={activeView === 'overview'}
              aria-controls="overview-panel"
            >
              Overview
            </button>
            <button
              className={`nav-tab ${activeView === 'published' ? 'nav-tab--active' : ''}`}
              onClick={() => setActiveView('published')}
              role="tab"
              aria-selected={activeView === 'published'}
              aria-controls="published-panel"
            >
              Published
            </button>
          </nav>
        </div>

        {/* ---- Metrics ---- */}
        {analytics && (
          <section className="metrics" aria-label="Dashboard metrics">
            <MetricCard label="Total Articles" value={analytics.summary.total} clickable onClick={() => handleMetricClick('total')} />
            <MetricCard label="Published" value={analytics.summary.published} accent="#166534" clickable onClick={() => handleMetricClick('published')} />
            <MetricCard label="Drafts" value={analytics.summary.drafts} accent="#b45309" clickable onClick={() => handleMetricClick('drafts')} />
            <MetricCard label="Total Views" value={analytics.summary.total_views} accent="#1d4ed8" clickable onClick={() => handleMetricClick('views')} />
            <MetricCard label="Avg Rating" value={Number(analytics.summary.avg_rating).toFixed(2)} accent="#7c3aed" clickable onClick={() => handleMetricClick('rating')} />
          </section>
        )}

        {loading && !analytics && <p className="dashboard__loading" aria-live="polite">Loading metrics…</p>}
        {error && <p className="dashboard__error" role="alert">Error: {error}</p>}

        {/* ---- Content ---- */}
        {activeView === 'overview' && (
          <div className="overview" id="overview-panel" role="tabpanel">
            <SectionCard title="Drafts" action={drafts.length > 0 && <span className="pill">{drafts.length}</span>}>
              {drafts.length ? (
                <ul className="article-list">
                  {drafts.slice(0, 6).map(d => <ArticleListItem key={d.id} a={d} onPublish={handlePublish} onEdit={handleEdit} />)}
                </ul>
              ) : <EmptyState text="No drafts – start a new article." />}
            </SectionCard>

            <SectionCard title="Recently Published" action={published.length > 0 && <span className="pill">{published.length}</span>}>
              {published.length ? (
                <ul className="article-list">
                  {published.slice(0, 6).map(p => <ArticleListItem key={p.id} a={p} onEdit={handleEdit} />)}
                </ul>
              ) : <EmptyState text="Nothing published yet." />}
            </SectionCard>

            <SectionCard title="Top Viewed" action={analytics?.top?.length > 0 && <span className="pill">{analytics.top.length}</span>}>
              {analytics?.top?.length ? (
                <ul className="article-list">
                  {analytics.top.slice(0, 6).map(t => <ArticleListItem key={t.id} a={t} showViews showRating />)}
                </ul>
              ) : <EmptyState text="No view data yet." />}
            </SectionCard>
          </div>
        )}

        {activeView === 'published' && (
          <div className="published-view" id="published-panel" role="tabpanel">
            <h2 className="published-view__title">Published Articles & Comments</h2>
            {published.length ? (
              published.map(article => (
                <section key={article.id} className="article-card" aria-labelledby={`article-${article.id}`}>
                  <header className="article-card__header">
                    <h3 id={`article-${article.id}`}>{article.title}</h3>
                    <div className="article-card__meta">
                      <span>👁 {article.views_count || 0} views</span>
                      <span>⭐ {article.rating_average || 0} ({article.rating_count || 0} ratings)</span>
                      <span>📅 {new Date(article.created_at).toLocaleDateString()}</span>
                      <button className="btn btn--icon" title="Edit article" onClick={() => handleEdit(article.id)} aria-label={`Edit ${article.title}`}>
                        ✏️ Edit
                      </button>
                    </div>
                  </header>
                  <div className="article-card__comments">
                    <h4>Comments ({articleComments[article.id]?.length || 0})</h4>
                    {articleComments[article.id]?.length ? (
                      articleComments[article.id].map(c => (
                        <div key={c.id} className="comment" role="article">
                          <div className="comment__header">
                            <span className="comment__author">{c.author_name}</span>
                            <span className="comment__date">{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                          <p>{c.content}</p>
                          <button
                            className="btn btn--reply"
                            onClick={() => { setReplyingTo(c.id); setReplyText(''); }}
                            aria-label={`Reply to comment by ${c.author_name}`}
                          >
                            Reply
                          </button>
                          {replyingTo === c.id && (
                            <div className="reply-box">
                              <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Write your reply…"
                                aria-label="Reply to comment"
                                className="reply-box__textarea"
                              />
                              <div className="reply-box__actions">
                                <button
                                  className="btn btn--primary btn--small"
                                  onClick={() => handleReplySubmit(article.id, c.id)}
                                  aria-label="Post reply"
                                >
                                  Post
                                </button>
                                <button
                                  className="btn btn--outline btn--small"
                                  onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                  aria-label="Cancel reply"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : <p className="empty-state">No comments yet.</p>}
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
  <li className="article-list__item">
    <div className="article-list__content">
      <p className="article-list__title">{a.title || 'Untitled'}</p>
      <span className={`article-list__badge article-list__badge--${a.status}`}>{a.status}</span>
    </div>
    <div className="article-list__meta">
      {showViews && <span>👁 {a.views_count ?? 0}</span>}
      {showRating && <span>⭐ {a.rating_average ?? 0} ({a.rating_count ?? 0})</span>}
      {a.updated_at && <span>{new Date(a.updated_at).toLocaleDateString()}</span>}
    </div>
    <div className="article-list__actions">
      {onEdit && <button className="btn btn--icon" title="Edit article" onClick={() => onEdit(a.id)} aria-label={`Edit ${a.title || 'Untitled'}`}>✏️</button>}
      {a.status === 'draft' && onPublish && <button className="btn btn--icon" title="Publish article" onClick={() => onPublish(a.id)} aria-label={`Publish ${a.title || 'Untitled'}`}>🚀</button>}
    </div>
  </li>
);

const EmptyState = ({ text }) => <p className="empty-state" aria-live="polite">{text}</p>;