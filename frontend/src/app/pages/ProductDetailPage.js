import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, API_ORIGIN } from '../../services/api';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Truck, Shield, RotateCcw, Check, Minus, Plus, ZoomIn } from 'lucide-react';
import { ImageWithFallback } from '../components/imagefullbackk/ImageWithFallback';
import { useCart } from '../context/CartContext';

export function ProductDetailPage() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedView, setSelectedView] = useState('front');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      setProduct(data);
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]);
      }
      if (data.weights && data.weights.length > 0) {
        setSelectedWeight(data.weights[0]);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = () => {
    if (!product) return null;
    
    const imageMap = {
      front: product.imagePath,
      back: product.backImagePath,
      side: product.sideImagePath,
    };
    
    const imagePath = imageMap[selectedView];
    if (!imagePath) return null;
    
    const path = String(imagePath || '');
    let imageUrl = path;
    if (!/^https?:\/\//i.test(path) && !/^\/\//.test(path)) {
      const sep = path.startsWith('/') ? '' : '/';
      imageUrl = `${API_ORIGIN}${sep}${path}`;
    }
    return imageUrl;
  };

  const hasMultipleViews = product && (product.backImagePath || product.sideImagePath);

  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    
    setIsAdding(true);
    const options = {};
    if (selectedColor) options.color = selectedColor;
    if (selectedWeight) options.weight = selectedWeight;
    
    for (let i = 0; i < quantity; i++) {
      await addToCart(product, 1, options);
    }
    
    setTimeout(() => setIsAdding(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-zinc-400 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-red-100 dark:border-red-900/30 p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">{error || 'The product you\'re looking for doesn\'t exist'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm group">
              <div 
                className="aspect-square cursor-zoom-in"
                onMouseEnter={() => setImageZoom(true)}
                onMouseLeave={() => setImageZoom(false)}
              >
                {getProductImage() ? (
                  <ImageWithFallback
                    src={getProductImage()}
                    alt={`${product.name} - ${selectedView} view`}
                    className={`w-full h-full object-cover transition-transform duration-500 ${imageZoom ? 'scale-110' : 'scale-100'}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-zinc-800">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📷</span>
                      <p>No Image Available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Image Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all ${
                    isWishlisted ? 'text-red-500' : 'text-gray-600'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all text-gray-600 dark:text-zinc-300"
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Zoom indicator */}
              <div className="absolute bottom-4 left-4">
                <span className="flex items-center gap-1 px-3 py-1.5 bg-black/60 text-white rounded-full text-xs backdrop-blur-sm">
                  <ZoomIn className="h-3 w-3" />
                  Hover to zoom
                </span>
              </div>
            </div>

            {/* View Selector */}
            {hasMultipleViews && (
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedView('front')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    selectedView === 'front'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-slate-300'
                  }`}
                >
                  Front View
                </button>
                {product.backImagePath && (
                  <button
                    onClick={() => setSelectedView('back')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      selectedView === 'back'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-slate-300'
                    }`}
                  >
                    Back View
                  </button>
                )}
                {product.sideImagePath && (
                  <button
                    onClick={() => setSelectedView('side')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      selectedView === 'side'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-slate-300'
                    }`}
                  >
                    Side View
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              {product.category && (
                <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm font-medium mb-3">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-zinc-400">
                  ({Math.floor(product.rating * 87)} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                  R{product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-zinc-400">
                  Incl. VAT
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">SKU: {product.sku}</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className={`rounded-xl p-4 border ${
              isOutOfStock 
                ? 'bg-red-50 border-red-200' 
                : isLowStock 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-zinc-300">Availability:</span>
                <span className={`font-semibold flex items-center gap-2 ${
                  isOutOfStock 
                    ? 'text-red-600' 
                    : isLowStock 
                    ? 'text-orange-600' 
                    : 'text-emerald-600'
                }`}>
                  {isOutOfStock ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      Out of Stock
                    </>
                  ) : isLowStock ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                      Only {product.stock} left
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      In Stock
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></h2>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weight Selection */}
            {product.weights && product.weights.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Weight: <span className="text-gray-500 font-normal">{selectedWeight}</span></h2>
                <div className="flex flex-wrap gap-3">
                  {product.weights.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all ${
                        selectedWeight === weight
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Quantity</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock > 0 ? `${product.stock} available` : 'Not available'}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all ${
                isOutOfStock
                  ? 'bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/25'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="h-5 w-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {isOutOfStock ? 'Out of Stock' : `Add to Cart - R${(product.price * quantity).toFixed(2)}`}
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">Free Delivery</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Over R2000</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">2-Year Warranty</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Full Coverage</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                  <RotateCcw className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">30-Day Returns</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Easy Process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}