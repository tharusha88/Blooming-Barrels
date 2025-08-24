import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminCard from './AdminCard';
import AdminTable from './AdminTable';
import SearchBar from './SearchBar';
import StatCard from './StatCard';
import LoadingSpinner from './LoadingSpinner';

import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock_quantity: '',
    is_active: 1
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
  setProducts([]);
    // No backend: using mock data only
  }, []);

  const fetchCategories = async () => {
    // No backend: using mock categories if needed
    setCategories([]);
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (product.name || '').toLowerCase().includes(searchLower) ||
           (product.category_name || '').toLowerCase().includes(searchLower) ||
           (product.description || '').toLowerCase().includes(searchLower);
  });

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Mock delete: remove from local state only
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity || '',
      is_active: product.is_active || 1
    });
    // Reset image upload state
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSaveProduct = async () => {
    try {
      // Mock save: just update local state
      if (editingProduct) {
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData } : p
        ));
        toast.success('Product updated successfully');
      } else {
        const newProduct = { 
          id: Date.now(), 
          ...formData 
        };
        setProducts(prev => [...prev, newProduct]);
        toast.success('Product added successfully');
      }
      
      // Reset form
      setEditingProduct(null);
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        stock_quantity: '',
        is_active: 1
      });
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowAddModal(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      stock_quantity: '',
      is_active: 1
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    try {
      setUploading(true);
      // Mock image upload - create a fake URL
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
      const mockImageUrl = URL.createObjectURL(selectedFile);
      return mockImageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.is_active ? 0 : 1;
      
      // Mock toggle: update local state only
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, is_active: newStatus } : p
      ));
      
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Error updating product status');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  const addButton = (
    <button 
      className="admin-btn"
      onClick={() => setShowAddModal(true)}
    >
      <FaPlus /> Add New Product
    </button>
  );

  const tableColumns = [
    {
      key: 'id',
      title: 'ID',
      render: (value) => value
    },
    {
      key: 'image',
      title: 'Image',
      render: (value, product) => (
        <div className="product-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <FaImage />
          )}
        </div>
      )
    },
    {
      key: 'name',
      title: 'Name',
      render: (value) => value
    },
    {
      key: 'price',
      title: 'Price',
      render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`
    },
    {
      key: 'category_name',
      title: 'Category',
      render: (value) => value || 'Uncategorized'
    },
    {
      key: 'stock_quantity',
      title: 'Stock',
      render: (value) => value || 0
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="product-management">
      <AdminCard title="Product Management" actions={addButton}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products by name or category..."
        />

        <AdminTable 
          columns={tableColumns}
          data={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={(product) => handleDeleteProduct(product.id)}
          onToggleStatus={handleToggleStatus}
          loading={loading}
        />
      </AdminCard>

      {/* Product Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Products"
          value={products.length}
        />
        <StatCard
          title="Active Products"
          value={products.filter(p => p.is_active == 1).length}
        />
        <StatCard
          title="Out of Stock"
          value={products.filter(p => (p.stock_quantity || 0) == 0).length}
        />
      </div>

      {/* Edit/Add Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={handleCancelEdit}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Image</label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        id="image-upload"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="image-upload" className="image-upload-label">
                        <FaImage /> Choose Image
                      </label>
                      {imagePreview && (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                          <button 
                            type="button" 
                            onClick={() => {
                              setSelectedFile(null);
                              setImagePreview(null);
                            }}
                            className="remove-image-btn"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {!imagePreview && formData.image_url && (
                        <div className="current-image">
                          <img src={formData.image_url} alt="Current" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span>Current Image</span>
                        </div>
                      )}
                    </div>
                    <small style={{ color: '#666', fontSize: '12px' }}>
                      Or enter URL:
                    </small>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: parseInt(e.target.value)})}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? 'Uploading...' : (editingProduct ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
