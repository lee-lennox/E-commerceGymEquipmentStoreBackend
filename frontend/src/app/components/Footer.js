import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card dark:bg-black border-t border-border dark:border-white/5">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <Link to="/" className="inline-block">
                <span className="text-2xl font-bold text-primary dark:bg-gradient-to-r dark:from-white dark:via-gray-300 dark:to-gray-500 dark:bg-clip-text dark:text-transparent">
                  FitGear
                </span>
              </Link>
            </div>
            <p className="text-muted-foreground dark:text-gray-500 leading-relaxed">
              Your trusted destination for premium gym equipment. We help fitness enthusiasts build their dream gyms with quality products and expert guidance.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-muted dark:bg-white/5 border border-border dark:border-white/10 flex items-center justify-center hover:bg-muted/80 dark:hover:bg-white/10 hover:border-muted-foreground dark:hover:border-white/20 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-muted dark:bg-white/5 border border-border dark:border-white/10 flex items-center justify-center hover:bg-muted/80 dark:hover:bg-white/10 hover:border-muted-foreground dark:hover:border-white/20 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-muted dark:bg-white/5 border border-border dark:border-white/10 flex items-center justify-center hover:bg-muted/80 dark:hover:bg-white/10 hover:border-muted-foreground dark:hover:border-white/20 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-foreground dark:text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary dark:bg-gradient-to-b dark:from-gray-400 dark:to-gray-600 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/products" 
                  className="flex items-center gap-2 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="flex items-center gap-2 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center gap-2 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-foreground dark:text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary dark:bg-gradient-to-b dark:from-gray-400 dark:to-gray-600 rounded-full"></span>
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/shipping" 
                  className="flex items-center gap-2 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="flex items-center gap-2 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="flex items-center gap-2 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center gap-2 text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  Support Center
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-foreground dark:text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary dark:bg-gradient-to-b dark:from-gray-400 dark:to-gray-600 rounded-full"></span>
              Stay Connected
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground dark:text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground dark:text-gray-500">123 Fitness Street, Gym City, South Africa</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground dark:text-gray-500 flex-shrink-0" />
                <a href="tel:+27123456789" className="text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors">
                  +27 12 345 6789
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground dark:text-gray-500 flex-shrink-0" />
                <a href="mailto:info@fitgear.co.za" className="text-muted-foreground dark:text-gray-500 dark:hover:text-white transition-colors">
                  info@fitgear.co.za
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
                <p className="text-sm text-muted-foreground dark:text-gray-500 mb-4">
                Subscribe for exclusive offers and fitness tips
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                    className="flex-1 px-4 py-2.5 bg-muted dark:bg-white/5 border border-border dark:border-white/10 rounded-lg text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 focus:border-primary dark:focus:border-white/20 text-sm backdrop-blur-sm"
                />
                <button
                  type="submit"
                    className="px-4 py-2.5 bg-primary dark:bg-gradient-to-r dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 text-primary-foreground dark:text-white rounded-lg font-medium hover:bg-primary/90 dark:hover:from-gray-500 dark:hover:to-gray-400 transition-all text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground dark:text-gray-600">
              &copy; {currentYear} FitGear. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/shipping" 
                className="text-sm text-muted-foreground dark:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
              >
                Shipping Policy
              </Link>
              <Link 
                to="/returns" 
                className="text-sm text-muted-foreground dark:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
              >
                Return Policy
              </Link>
              <Link 
                to="/privacy" 
                className="text-sm text-muted-foreground dark:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-muted-foreground dark:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}