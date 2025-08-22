import React, { useState, useEffect } from 'react';
import { getStoredUser, getStoredToken } from '../../utils/jwt';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlistAPI';
import './ProductDetail.css';

const ProductDetail = ({ cart, setCart, user, isLoggedIn: isLoggedInProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  const [showCareInstructions, setShowCareInstructions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp || false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  // Fetch wishlist on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist()
        .then(items => setWishlist(items))
        .catch(() => setWishlist([]));
    } else {
      setWishlist([]);
    }
  }, [isLoggedIn]);

  // Helper: is product in wishlist
  const isInWishlist = product && wishlist.some(item => item.product_id === product.id || item.id === product.id);

  // Wishlist toggle handler
  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      alert('Please log in to use wishlist');
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }
    if (!product) return;
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        setWishlist(wishlist.filter(item => (item.product_id || item.id) !== product.id));
      } else {
        await addToWishlist(product.id);
        // Refetch wishlist for accuracy
        const updated = await fetchWishlist();
        setWishlist(updated);
      }
    } catch (e) {
      let msg = 'Failed to update wishlist';
      if (e && e.message) msg += `: ${e.message}`;
      alert(msg);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Restore login state from localStorage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    if (storedUser && storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000'
          : '';
        const endpoint = `${API_BASE}/api/products`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        if (data.success && data.products) {
          const foundProduct = data.products.find(p => p.id === parseInt(id));
          if (foundProduct) {
            setProduct(foundProduct);
            // Set default selections
            if (foundProduct.options?.potColor?.length > 0) {
              setSelectedColor(foundProduct.options.potColor[0]);
            }
            if (foundProduct.sizes?.length > 0) {
              setSelectedSize(foundProduct.sizes[0]);
            } else if (foundProduct.options?.size?.length > 0) {
              setSelectedSize(foundProduct.options.size[0]);
            }
            setLoading(false);
            return;
          } else {
            throw new Error('Product not found');
          }
        } else {
          throw new Error('Invalid product data');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Add to cart functionality
  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if user is logged in
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart');
      // Store current location for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }
    
    const cartItem = {
      ...product,
      selectedColor,
      selectedSize,
      quantity,
      uniqueId: `${product.id}-${selectedColor}-${selectedSize}-${Date.now()}`
    };
    
    setCart([...cart, cartItem]);
    alert('Product added to cart!');
  };

  // Buy now functionality
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert('Please log in to purchase items');
      // Store current location for redirect after login (include product id)
      localStorage.setItem('redirectAfterLogin', `/shop/product/${id}`);
      navigate('/login');
      return;
    }
    
    // Create checkout item with selected options
    const checkoutItem = {
      ...product,
      selectedColor,
      selectedSize,
      quantity,
      uniqueId: `${product.id}-${selectedColor}-${selectedSize}-${Date.now()}`
    };
    
    // Store single item for direct checkout in localStorage
    localStorage.setItem('directCheckoutItem', JSON.stringify(checkoutItem));
    
    // Navigate directly to checkout
    navigate('/checkout?direct=true');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`icon ${i < Math.floor(rating) ? 'star-filled' : 'star-empty'}`}
      />
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          Loading product details...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          ❌ {error || 'Product not found'}
          <button onClick={() => navigate('/shop')} style={{ marginLeft: '10px' }}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Prepare images array - use database images or create fallback
  const generateProductImages = (product) => {
    console.log('Product data:', product); // Debug log
    
    // If product has images from database, use them
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      console.log('Using database images:', product.images); // Debug log
      return product.images
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(img => img.url);
    }
    
    console.log('No database images found, generating fallback gallery'); // Debug log
    
    // Fallback: create a sample gallery with available images
    const baseImage = product.image_url || product.image;
    const fallbackImages = [
      '/images/ceramic-pot.jpg',
      '/images/glazed.jpg',
      '/images/self-watering.jpg',
      '/images/herb-pot.jpg',
      '/images/coco-planter.jpg'
    ];
    
    if (baseImage) {
      // Use the product's main image first, then add other sample images
      return [
        baseImage,
        ...fallbackImages.filter(img => img !== baseImage).slice(0, 4)
      ];
    }
    
    // Last resort: use all sample images
    return fallbackImages.slice(0, 5);
  };

  const productImages = generateProductImages(product);
  const availableColors = product.options?.potColor || product.colors || [];
  const availableSizes = product.sizes || product.options?.size || [];

  return (
    <div className="product-detail-container">
      {/* Main Product Content */}
      <div className="product-main">
        <div className="product-layout">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="main-image-container">
              <img
                src={productImages[selectedImage] || product.image}
                alt={product.name}
                className="product-image"
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    className="nav-btn nav-btn-left"
                  >
                    <ChevronLeft className="icon" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(Math.min(productImages.length - 1, selectedImage + 1))}
                    className="nav-btn nav-btn-right"
                  >
                    <ChevronRight className="icon" />
                  </button>
                </>
              )}
            </div>
            {productImages && productImages.length > 0 && (
              <div className="thumbnail-container">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail ${selectedImage === index ? 'thumbnail-active' : ''}`}
                  >
                    <img src={image} alt={`Product view ${index + 1}`} className="thumbnail-image" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h2>{product.name}</h2>
              <div className="price-section">
                <span className="product-price">Rs {product.basePrice || product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">Rs {product.originalPrice}</span>
                )}
              </div>
              <div className="rating-section">
                <div className="stars">
                  {renderStars(product.rating || 4.5)}
                </div>
                <span className="review-count">({product.reviewCount || 0} Reviews)</span>
              </div>
              <p className="product-description">{product.description}</p>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="product-options">
                <label>Color:</label>
                <div className="color-options">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`color-option-btn ${
                        selectedColor === color ? 'selected' : ''
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="product-options">
                <label>Size:</label>
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="product-options">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  <Minus className="icon" />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  <Plus className="icon" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart className="icon" />
                <span>{isLoggedIn ? 'Add to Cart' : 'Login to Add to Cart'}</span>
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                {isLoggedIn ? 'Buy Now' : 'Login to Buy Now'}
              </button>
              <button className={`icon-btn wishlist-btn ${isInWishlist ? 'active' : ''}`} onClick={handleWishlistToggle} disabled={wishlistLoading} title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                <Heart className="icon" fill={isInWishlist ? 'red' : 'none'} stroke={isInWishlist ? 'red' : 'currentColor'} />
                {wishlistLoading && <span className="wishlist-spinner"></span>}
              </button>
              <button className="icon-btn">
                <Share2 className="icon" />
              </button>
            </div>

            {/* Features & Care */}
            {(product.features || product.careInstructions) && (
              <div className="features-section">
                {product.features && (
                  <div className="feature-item">
                    <button
                      onClick={() => setShowFeatures(!showFeatures)}
                      className="feature-toggle"
                    >
                      Key Features
                      <ChevronRight className={`icon ${showFeatures ? 'rotate' : ''}`} />
                    </button>
                    {showFeatures && (
                      <ul className="feature-list">
                        {product.features.map((feature, index) => (
                          <li key={index} className="feature-list-item">
                            <span className="bullet"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {product.careInstructions && (
                  <div className="feature-item">
                    <button
                      onClick={() => setShowCareInstructions(!showCareInstructions)}
                      className="feature-toggle"
                    >
                      Care Instructions
                      <ChevronRight className={`icon ${showCareInstructions ? 'rotate' : ''}`} />
                    </button>
                    {showCareInstructions && (
                      <ul className="feature-list">
                        {product.careInstructions.map((instruction, index) => (
                          <li key={index} className="feature-list-item">
                            <span className="bullet"></span>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;