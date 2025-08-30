import React, { useState, useEffect } from 'react';

// Replace with your actual API endpoints
const API_BASE = 'http://localhost:8000';

function CommentSection({ articleId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState('');

  // Fetch comments for the article
  useEffect(() => {
    fetch(`${API_BASE}/api/article/${articleId}/comments`)
      .then(res => res.json())
      .then(data => setComments(data.reverse())) // reverse for newest first
      .catch(() => setComments([]));
  }, [articleId]);

  // Submit new comment or reply
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    const payload = {
      article_id: articleId,
      user_id: currentUser?.id,
      content,
      parent_id: replyTo,
    };
    const res = await fetch(`${API_BASE}/api/article/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setContent('');
      setReplyTo(null);
    } else {
      setError('Failed to post comment.');
    }
  };

  // Render comments recursively for replies
  const renderComments = (parentId = null, level = 0) =>
    comments
      .filter(c => c.parent_id === parentId)
      .map(c => (
        <div className="comment" key={c.id} style={{ marginLeft: level * 24 }}>
          <div className="comment-header">
            <span className="comment-user">{c.user_name || 'User'}</span>
            <span className="comment-time">{new Date(c.created_at).toLocaleString()}</span>
          </div>
          <div className="comment-content">{c.content}</div>
          <div className="comment-actions">
            <button onClick={() => { setReplyTo(c.id); setContent(''); }}>Reply</button>
          </div>
          {renderComments(c.id, level + 1)}
        </div>
      ));

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {currentUser ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          {replyTo && (
            <div className="replying-to">
              Replying to comment #{replyTo}
              <button type="button" onClick={() => setReplyTo(null)}>Cancel</button>
            </div>
          )}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />
          {error && <div className="comment-error">{error}</div>}
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <div className="comment-login-prompt">
          Please <a href="/login">log in</a> to post a comment.
        </div>
      )}
      <div className="comment-list">
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet.</div>
        ) : (
          renderComments()
        )}
      </div>
    </div>
  );
}

export default CommentSection;