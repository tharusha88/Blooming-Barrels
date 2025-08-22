import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Emerald Green');
  const [selectedSize, setSelectedSize] = useState('Small (0.5L)');
  const [showFeatures, setShowFeatures] = useState(false);
  const [showCareInstructions, setShowCareInstructions] = useState(false);

  const product = {
    name: "Elegant Ceramic Watering Can",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.3,
    reviewCount: 124,
    description: "Cultivate your indoor oasis with our handcrafted ceramic watering can. Its minimalist design and ergonomic handle make plant care a joy, while the precise spout ensures just the watering for even your most delicate blooms. Available in a range of earthy tones to complement any decor.",
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=500&fit=crop"
    ],
    colors: ['Emerald Green', 'Sage', 'Terracotta', 'Cream'],
    sizes: ['Small (0.5L)', 'Medium (1L)', 'Large (1.5L)'],
    features: [
      "Handcrafted ceramic construction",
      "Ergonomic handle for comfortable grip",
      "Precision spout for accurate watering",
      "Available in multiple earthy tones",
      "Perfect for indoor and outdoor plants"
    ],
    careInstructions: [
      "Hand wash with mild soap and warm water",
      "Avoid harsh abrasives or chemicals",
      "Dry thoroughly before storage",
      "Store in a cool, dry place"
    ]
  };

  const reviews = [
    {
      name: "Alice M.",
      date: "2024-03-15",
      rating: 5,
      comment: "Absolutely beautiful watering can! It looks stunning on my windowsill and is so comfortable to hold. Perfect for my small herb garden.",
      helpful: 12
    },
    {
      name: "Ben S.",
      date: "2024-03-10",
      rating: 4,
      comment: "Great design and good quality. The spout is very precise. Only wish it came in more colors.",
      helpful: 8
    },
    {
      name: "Clara R.",
      date: "2024-03-01",
      rating: 5,
      comment: "A true piece of art! Watering my plants has become a serene ritual. Highly recommend the matte white.",
      helpful: 15
    }
  ];

  const relatedProducts = [
    {
      name: "Organic Seed Starter Kit",
      price: 24.99,
      rating: 4.2,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop"
    },
    {
      name: "Minimalist Planter Set",
      price: 34.00,
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop"
    },
    {
      name: "Professional Pruning Shears",
      price: 19.50,
      rating: 4.6,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop"
    },
    {
      name: "Smart Soil Moisture Meter",
      price: 12.99,
      rating: 4.1,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <span className="font-semibold text-gray-800">Blooming Barrels</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-800">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Shop</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Learn</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Templates</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Trust</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">Sign Up</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Log In</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-green-600">${product.price}</span>
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">({product.reviewCount} Reviews)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color:</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedColor === color
                        ? 'border-green-600 bg-green-50 text-green-800'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size:</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size
                        ? 'border-green-600 bg-green-50 text-green-800'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity:</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200">
                Buy Now
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features & Care */}
            <div className="space-y-4">
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="flex items-center justify-between w-full text-left font-semibold"
                >
                  Key Features
                  <ChevronRight className={`w-5 h-5 transform transition-transform ${showFeatures ? 'rotate-90' : ''}`} />
                </button>
                {showFeatures && (
                  <ul className="mt-3 space-y-2 text-gray-600">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => setShowCareInstructions(!showCareInstructions)}
                  className="flex items-center justify-between w-full text-left font-semibold"
                >
                  Care Instructions
                  <ChevronRight className={`w-5 h-5 transform transition-transform ${showCareInstructions ? 'rotate-90' : ''}`} />
                </button>
                {showCareInstructions && (
                  <ul className="mt-3 space-y-2 text-gray-600">
                    {product.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="font-semibold">{product.rating} out of 5</span>
              <span className="text-gray-600">({product.reviewCount} total ratings)</span>
            </div>
            
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{review.comment}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="hover:text-gray-700">👍 Helpful ({review.helpful})</button>
                    <button className="hover:text-gray-700">👎 Not Helpful</button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 text-green-600 hover:text-green-700 font-semibold">
              Write a Review
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  <p className="font-bold text-green-600">${product.price}</p>
                  <button className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;