import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/jwt';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
  // tags removed
    category_id: null,
    featured_image: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  

  // tags state removed
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadArticle();
    }
  }, [id, isEdit]);

  useEffect(() => {
  fetch('/api/article_categories', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load categories');
        return res.json();
      })
      .then(data => setCategories(data))
      .catch(err => {
        setError('Failed to load categories: ' + err.message);
        setCategories([]);
      });
  }, []);


  const loadArticle = async () => {
    try {
  const res = await fetch(`/api/articles/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load article');
      const data = await res.json();
      setFormData({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        category_id: data.category_id,
        featured_image: data.featured_image || '',
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      setError('You must be logged in to save an article.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      let response, data;
      if (!isEdit) {
        // Create new article
        response = await fetch('/api/articles', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            author_id: user?.id,
            status: 'draft',
          })
        });
        data = await response.json();
        if (!response.ok || !data.success) throw new Error('Failed to create article');
        // Optionally, fetch the new article's ID from backend if returned
        // For now, reload dashboard
        navigate('/garden-expert/dashboard');
      } else {
        // Update existing article
        response = await fetch(`/api/articles/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        data = await response.json();
        if (!response.ok || !data.success) throw new Error('Failed to update article');
        setError(null);
        // Optionally, show a toast here
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user || !user.id) {
      setError('You must be logged in to publish an article.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    setPublishing(true);
    setError(null);
    try {
      let response, data;
      if (!isEdit) {
        // Create new article as published
        response = await fetch('/api/articles', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            author_id: user?.id,
            status: 'published',
          })
        });
        data = await response.json();
        if (!response.ok || !data.success) throw new Error('Failed to publish article');
        navigate('/garden-expert/dashboard');
      } else {
        // Update existing article to published
        response = await fetch(`/api/articles/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, status: 'published' })
        });
        data = await response.json();
        if (!response.ok || !data.success) throw new Error('Failed to publish article');
        navigate('/garden-expert/dashboard');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setPublishing(false);
    }
  };

  // tag handlers removed

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      // Mock image upload - create a fake URL
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
      const mockImageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        featured_image: mockImageUrl
      }));
    } catch (error) {
      setError('Failed to upload image: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh'}}>
        <div style={{padding:'2rem', textAlign:'center'}}>
          <p>Loading article...</p>
          {error && <p style={{color:'#dc2626'}}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{background:'#f8fafc', minHeight:'100vh'}}>
      <main style={{maxWidth:900, margin:'2rem auto 3rem', padding:'0 2rem'}}>
        
        {/* Header */}
        <header style={{marginBottom:'2rem'}}>
          <button 
            onClick={() => navigate('/garden-expert/dashboard')}
            style={{...btnSubtle, marginBottom:'1rem'}}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{margin:0, fontSize:32, fontWeight:700, color:'#0f172a'}}>
            {isEdit ? 'Edit Article' : 'New Article'}
          </h1>
        </header>

        {error && (
          <div style={{background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'1rem', marginBottom:'1.5rem', color:'#dc2626'}}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{background:'#fff', borderRadius:16, padding:'2rem', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          
          {/* Title */}
          <div style={{marginBottom:'1.5rem'}}>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              placeholder="Enter article title..."
              style={inputStyle}
            />
          </div>

          {/* Excerpt */}
          <div style={{marginBottom:'1.5rem'}}>
            <label style={labelStyle}>Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
              placeholder="Brief summary of the article..."
              rows={3}
              style={textareaStyle}
            />
          </div>
          {/* Category */}
<div style={{ marginBottom: '1.5rem' }}>
  <label style={labelStyle}>Category *</label>
  <select
    value={formData.category_id || ''}
    onChange={(e) => setFormData(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
    style={inputStyle}
    required
  >
    <option value="">-- Select Category --</option>
    {categories.map(cat => (
      <option key={cat.id} value={cat.id}>{cat.name}</option>
    ))}
  </select>
</div>


          {/* Content */}
          <div style={{marginBottom:'1.5rem'}}>
            <label style={labelStyle}>Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
              placeholder="Write your gardening guide here..."
              rows={15}
              style={textareaStyle}
            />
          </div>

          {/* Tags section fully removed */}

          {/* Featured Image */}
          <div style={{marginBottom:'2rem'}}>
            <label style={labelStyle}>Featured Image</label>
            <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{
                  ...inputStyle,
                  padding: '0.75rem',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  background: uploadingImage ? '#f9fafb' : '#fff',
                  cursor: uploadingImage ? 'not-allowed' : 'pointer'
                }}
              />
              {uploadingImage && (
                <p style={{color:'#6b7280', fontSize:'14px', margin:0}}>
                  Uploading image...
                </p>
              )}
              {formData.featured_image && (
                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                  <img
                    src={`http://localhost${formData.featured_image}`}
                    alt="Featured"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, featured_image: ''}))}
                    style={{
                      ...btnSubtle,
                      width: 'fit-content',
                      fontSize: '12px',
                      padding: '0.5rem 0.75rem'
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{display:'flex', gap:'1rem', justifyContent:'flex-end'}}>
            <button 
              onClick={handleSave}
              disabled={saving}
              style={btnPrimary}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button 
              onClick={handlePublish}
              disabled={publishing}
              style={btnSuccess}
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Styles
const labelStyle = {display:'block', fontSize:14, fontWeight:600, color:'#374151', marginBottom:'0.5rem'};
const inputStyle = {width:'100%', padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:8, fontSize:14};
const textareaStyle = {...inputStyle, resize:'vertical', fontFamily:'inherit'};
const btnBase = {cursor:'pointer', border:'1px solid transparent', fontSize:14, fontWeight:500, borderRadius:8, padding:'0.75rem 1.5rem', display:'inline-flex', alignItems:'center', gap:'0.5rem'};
const btnPrimary = {...btnBase, background:'#065f46', color:'#fff'};
const btnSuccess = {...btnBase, background:'#059669', color:'#fff'};
const btnSubtle = {...btnBase, background:'#f3f4f6', color:'#374151', border:'1px solid #d1d5db'};
// tagStyle removed
const tagRemoveStyle = {background:'none', border:'none', color:'#6b7280', cursor:'pointer', padding:0, fontSize:14};
