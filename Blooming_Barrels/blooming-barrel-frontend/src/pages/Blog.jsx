import { getStoredUser } from '../utils/jwt';
// pages/Blog.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navigation/Navbar";
import "./Blog.css";


export default function Blog() {
  const user = getStoredUser();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  // Optionally: add user/cartCount/isLoggedIn/onLogout props if needed

  // Fetch categories + articles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, artRes] = await Promise.all([
          axios.get("/api/article_categories"),
          axios.get("/api/articles"),
        ]);

        // Format categories
        setCategories([{ id: 0, name: "All" }, ...catRes.data]);

        // Articles from backend
        setArticles(artRes.data);
      } catch (err) {
        console.error("Error loading blog data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering
  const filteredArticles = articles.filter((post) => {
    const categoryMatch =
      selectedCategory === "All" || post.category_name === selectedCategory;
    const searchMatch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Featured article
  const featuredPost = filteredArticles.find((post) => post.featured === 1);
  const regularPosts = filteredArticles.filter((p) => p !== featuredPost);

  if (loading) {
    return (
      <div className="blog-loading">
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <>
  <Navbar user={user} />
      <div className="blog-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="hero-content">
          <h1>Garden Learning Hub</h1>
          <p>
            Expert tips, guides, and inspiration to help you grow your perfect
            garden
          </p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="blog-filters">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${
                selectedCategory === cat.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && selectedCategory === "All" && searchQuery === "" && (
        <div className="featured-post">
          <div className="featured-image">
            {featuredPost.featured_image ? (
              <img src={featuredPost.featured_image} alt={featuredPost.title} />
            ) : null}
            <div className="featured-badge">Featured</div>
          </div>
          <div className="featured-content">
            <div className="post-meta">
              <span className="category">{featuredPost.category_name}</span>
              <span className="date">
                {new Date(featuredPost.published_at).toLocaleDateString()}
              </span>
              <span className="read-time">{featuredPost.read_time} min read</span>
            </div>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            <div className="author">
              <span>By {featuredPost.author}</span>
            </div>
            <button className="read-more-btn">Read Full Article</button>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="blog-grid">
        {regularPosts.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          regularPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                {post.featured_image ? (
                  <img src={post.featured_image} alt={post.title} />
                ) : null}
                <div className="category-badge">{post.category_name}</div>
              </div>
              <div className="blog-content">
                <div className="post-meta">
                  <span className="date">
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                  <span className="read-time">{post.read_time} min read</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <button className="read-more-btn" onClick={() => window.location.href = `/blog/${post.id}`}>Read More</button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>
            Get the latest gardening tips and exclusive content delivered to your
            inbox
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="email-input"
            />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
