
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ArticleDetails.css";

export default function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    axios.get(`/api/articles/${id}`)
      .then(res => {
        // Handle both { ...article fields... } and { article: { ... } }
        if (res.data && typeof res.data === 'object') {
          if (res.data.article) {
            setArticle(res.data.article);
          } else {
            setArticle(res.data);
          }
        } else {
          setArticle(null);
        }
      })
      .catch(err => setError("Failed to load article."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="article-details-page"><div>Loading...</div></div>;
  if (error) return <div className="article-details-page"><div>{error}</div></div>;
  if (!article) return <div className="article-details-page"><div>Article not found.</div></div>;

  return (
    <div className="article-details-page">
      <button onClick={() => navigate(-1)}>← Back</button>
      <div className="article-details">
        {article.featured_image && (
          <img src={article.featured_image} alt={article.title} />
        )}
        <h1>{article.title}</h1>
        <div className="meta">
          <span>{article.category_name}</span> | <span>{new Date(article.published_at).toLocaleDateString()}</span>
        </div>
        <div className="excerpt">{article.excerpt}</div>
        <div className="content">{article.content}</div>
      </div>
    </div>
  );
}
