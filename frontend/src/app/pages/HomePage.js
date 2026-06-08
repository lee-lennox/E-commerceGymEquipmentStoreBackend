import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../../services/api';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section - Charcoal with Silver Water */}
      <section className="relative h-[700px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop)',
          }}
        >
          {/* Dark gradient overlay for charcoal theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40"></div>
          {/* Silver water shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
        </div>
        
        {/* Animated silver particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gray-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Transform Your <br/>
              <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-400 max-w-2xl leading-relaxed">
              Premium gym equipment for your home and professional training. 
              Build your dream gym with our curated selection of top-tier fitness gear.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="group px-8 py-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-500 hover:to-gray-400 transition-all shadow-xl hover:shadow-2xl hover:shadow-gray-500/20 flex items-center gap-2 backdrop-blur-sm"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 mb-4">
              Featured Collection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top-Rated Equipment
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Discover our most popular gym equipment, chosen by fitness enthusiasts nationwide
            </p>
          </div>
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-500 hover:to-gray-400 transition-all shadow-xl"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark with Silver */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their homes into personal gyms
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all shadow-xl hover:shadow-2xl"
            >
              Browse Products
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}