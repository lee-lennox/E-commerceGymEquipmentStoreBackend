import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ShoppingCart, Settings, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  const { setIsCartOpen, getCartCount } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const profileDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    const handleUserChange = () => {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    };

    window.addEventListener('storage', handleUserChange);
    window.addEventListener('userLogin', handleUserChange);
    window.addEventListener('userLogout', handleUserChange);
    
    return () => {
      window.removeEventListener('storage', handleUserChange);
      window.removeEventListener('userLogin', handleUserChange);
      window.removeEventListener('userLogout', handleUserChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchOpen && searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        if (!event.target.closest('[data-search-button]')) {
          setSearchOpen(false);
        }
      }
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (profileDropdownOpen || searchOpen || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileDropdownOpen, searchOpen, mobileMenuOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userLogout'));
    window.location.href = '/';
  };

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="bg-white dark:bg-zinc-900/90 backdrop-blur-xl border-b border-border dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold text-zinc-900 dark:bg-gradient-to-r dark:from-white dark:via-zinc-300 dark:to-zinc-500 dark:bg-clip-text dark:text-transparent group-hover:from-zinc-600 group-hover:to-zinc-900 transition-all duration-500">
              FitGear
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-muted-foreground dark:text-zinc-400 dark:hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-zinc-900 dark:after:bg-gradient-to-r dark:after:from-zinc-400 dark:after:to-white after:transition-all hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-muted-foreground dark:text-zinc-400 dark:hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-zinc-900 dark:after:bg-gradient-to-r dark:after:from-zinc-400 dark:after:to-white after:transition-all hover:after:w-full"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground dark:text-zinc-400 dark:hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-zinc-900 dark:after:bg-gradient-to-r dark:after:from-zinc-400 dark:after:to-white after:transition-all hover:after:w-full"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-muted-foreground dark:text-zinc-400 dark:hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-zinc-900 dark:after:bg-gradient-to-r dark:after:from-zinc-400 dark:after:to-white after:transition-all hover:after:w-full"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative" ref={searchInputRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 px-4 py-2 pr-10 bg-muted dark:bg-zinc-800/50 border border-border dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white/20 text-sm text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-zinc-500 transition-all backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                data-search-button
                onClick={handleSearchClick}
                className="p-2 text-muted-foreground dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-all"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            
            {/* Admin Dashboard */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="p-2 text-muted-foreground dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-all" 
                title="Admin Dashboard"
                aria-label="Admin Dashboard"
              >
                <Settings className="h-5 w-5" />
              </Link>
            )}
            
            {/* Notifications */}
            <button className="p-2 text-muted-foreground dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-all relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></span>
            </button>
            
            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-muted-foreground dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-all relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 dark:bg-gradient-to-r dark:from-zinc-400 dark:to-zinc-600 text-white dark:text-black text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow-lg">
                  {getCartCount()}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 text-muted-foreground dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-400 dark:to-zinc-600 flex items-center justify-center text-white dark:text-black text-sm font-semibold shadow-lg">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card dark:bg-zinc-900 backdrop-blur-xl rounded-xl shadow-2xl border border-border dark:border-zinc-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border dark:border-zinc-800/50">
                      <p className="text-sm font-semibold text-foreground dark:text-white">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30' 
                            : 'bg-gray-500/20 text-gray-600 dark:text-gray-300 border border-gray-500/30'
                        }`}>
                          {user.role || 'BUYER'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-border dark:border-zinc-800/50 py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/signin" 
                  className="px-4 py-2 text-muted-foreground dark:text-zinc-300 dark:hover:text-white font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2 bg-zinc-900 dark:bg-gradient-to-r dark:from-zinc-600 dark:via-zinc-500 dark:to-zinc-600 text-white rounded-lg font-medium hover:bg-zinc-800 dark:hover:from-zinc-500 dark:hover:to-zinc-400 transition-all shadow-lg hover:shadow-xl dark:shadow-zinc-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-muted-foreground dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-all"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border dark:border-zinc-800 py-4 bg-card dark:bg-zinc-900" ref={mobileMenuRef}>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-4 py-2 text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {!user && (
                <>
                  <Link 
                    to="/signin" 
                    className="px-4 py-2 text-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="mx-4 mt-2 px-4 py-2 bg-zinc-900 dark:bg-gradient-to-r dark:from-zinc-600 dark:via-zinc-500 dark:to-zinc-600 text-white rounded-lg font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
