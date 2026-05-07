import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';
import { API_ORIGIN } from '../../services/api';
import { ImageWithFallback } from '../components/imagefullbackk/ImageWithFallback';

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { orderNumber, total, email, items } = location.state || {};

  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!orderNumber) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="font-bold text-lg">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Total</p>
                <p className="font-bold text-lg">R{total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-left">
              <p className="text-sm text-gray-600 mb-1">Confirmation Email Sent To</p>
              <p className="font-semibold">{email}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => {
                return (
                  <div key={item.product.productId} className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imagePath && (
                        <ImageWithFallback
                          src={`${API_ORIGIN}${item.product.imagePath}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">R{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">What's Next?</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• You'll receive an order confirmation email shortly</li>
              <li>• Track your order status in your account</li>
              <li>• Estimated delivery: 3-5 business days</li>
              <li>• Free returns within 30 days</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/products')}
              className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              Continue Shopping
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
