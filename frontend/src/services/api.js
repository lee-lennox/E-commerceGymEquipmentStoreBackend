import axios from 'axios';

// API Configuration - Use production backend by default
// Note: Backend has context-path=/api, so we use the Render URL as the base
const PRODUCTION_API_BASE = 'https://gymstore-5ni9.onrender.com/api';
const LOCAL_API_BASE = 'http://localhost:8080/api';

// Check for environment variable override, otherwise use local
const rawApiUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;

function normalizeApiBase(url) {
  if (!url) return LOCAL_API_BASE;
  let u = String(url).trim();
  try {
    // If starts with colon like ":8080" — make it explicit using localhost
    if (/^:\d+/.test(u)) {
      u = window?.location?.protocol + '//' + (window?.location?.hostname || 'localhost') + u;
    }
    // If starts with '//' or missing protocol, add http://
    if (!/^https?:\/\//i.test(u)) {
      // If begins with '//' keep origin-less form
      if (/^\/\//.test(u)) {
        u = window?.location?.protocol + u;
      } else {
        u = 'http://' + u;
      }
    }
    // Ensure trailing '/api' exists (many backend endpoints expect /api prefix)
    if (!/\/api(\/|$)/.test(u)) {
      u = u.replace(/\/+$/,'') + '/api';
    }
    return u;
  } catch (e) {
    return LOCAL_API_BASE;
  }
}

const API_BASE = rawApiUrl ? normalizeApiBase(rawApiUrl) : PRODUCTION_API_BASE;

// API origin (without the `/api` suffix) — useful for image/static file URLs
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/i, '');

// Log the resolved API base for easier debugging in dev tools
if (typeof window !== 'undefined' && window.console) {
  console.info('[api] Using API_BASE =', API_BASE);
  console.info('[api] Using API_ORIGIN =', API_ORIGIN);
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Note: If the local backend is not running, you'll see connection refused errors.
// Start the backend with: cd Backend && mvn spring-boot:run

// Categories
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

// Alias for getCategories for consistency
export const getAllCategories = getCategories;

// Products
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

// Search products by query
export const searchProducts = async (query) => {
  try {
    const response = await api.get('/products/search', { params: { keyword: query } });
    return response.data;
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get product');
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createProduct = async (productData) => {
  try {
    // Check if it's FormData (for file upload)
    const isFormData = productData instanceof FormData;
    const response = await api.post('/products', productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Check if it's FormData (for file upload)
    const isFormData = productData instanceof FormData;
    const response = await api.put(`/products/${id}`, productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

export const decreaseProductStock = async (productId, quantity) => {
  try {
    const response = await api.patch(`/products/${productId}/decrease-stock`, { quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update stock');
  }
};

// Users Management (Admin)
export const getUsers = async (role = null) => {
  try {
    const params = role ? { role } : {};
    const response = await api.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user');
  }
};

export const createUser = async (user) => {
  try {
    const response = await api.post('/admin/users', user);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await api.put(`/admin/users/${id}`, user);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/admin/users/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Category Management
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get category');
  }
};

export const createCategory = async (category) => {
  try {
    const response = await api.post('/categories', category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create category');
  }
};

export const updateCategory = async (id, category) => {
  try {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update category');
  }
};

export const deleteCategory = async (id) => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete category');
  }
};

export const getCategoryByName = async (name) => {
  try {
    const response = await api.get(`/categories/name/${name}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get category by name');
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get category by slug');
  }
};

// Authentication
export const registerUser = async (name, email, phone, password) => {
  try {
    // Clear any stored user data to prevent stale tokens
    localStorage.removeItem('user');
    
    // Create a separate axios instance without auth interceptor for public endpoints
    const publicApi = axios.create({
      baseURL: API_BASE,
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await publicApi.post('/users/register', { name, email, phone, password });
    return response.data;
  } catch (error) {
    // Log the full error for debugging
    console.error('[registerUser] Error:', error.response?.status, error.response?.data);
    
    // Get the error message from the backend response
    const backendMessage = error.response?.data?.message || error.response?.data?.error;
    
    if (error.response?.status === 409) {
      // Use backend message if available, otherwise use default
      throw new Error(backendMessage || 'Email already registered');
    }
    if (error.response?.status === 403) {
      throw new Error(backendMessage || 'Access denied. Please check your permissions.');
    }
    if (error.response?.status === 400) {
      throw new Error(backendMessage || 'Invalid registration data');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(backendMessage || 'Registration failed. Please try again.');
  }
};

// Helper function for public API calls (no auth header)
const publicApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const loginUser = async (email, password) => {
  try {
    const response = await publicApi.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    // Get the error message from the backend response
    const backendMessage = error.response?.data?.message || error.response?.data?.error;
    
    if (error.response?.status === 401) {
      // Use backend message if available - it might contain specific info like "Please verify your email"
      throw new Error(backendMessage || 'Invalid email or password');
    }
    if (error.response?.status === 400) {
      throw new Error(backendMessage || 'Invalid login data');
    }
    throw new Error(backendMessage || 'Login failed');
  }
};

// Password reset: request a reset token to be emailed
export const requestPasswordReset = async (email) => {
  try {
    const response = await publicApi.post('/users/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request password reset');
  }
};

// Reset password using token and new password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await publicApi.post('/users/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await publicApi.get('/users/exists', { params: { email } });
    return response.data;
  } catch (error) {
    return false;
  }
};

// OTP Verification
export const verifyOtp = async (email, otp) => {
  try {
    const response = await publicApi.post('/users/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid or expired OTP');
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await publicApi.post('/users/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

// Buyer Profile
export const getBuyerProfile = async (userId) => {
  try {
    const response = await api.get(`/buyer/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get buyer profile');
  }
};

// Current User Profile (uses buyer/profile endpoint)
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/buyer/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/buyer/profile/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Address Management
export const getAllAddresses = async () => {
  try {
    const response = await api.get('/addresses');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getAddressById = async (addressId) => {
  try {
    const response = await api.get(`/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get address');
  }
};

export const createAddress = async (addressData) => {
  try {
    const response = await api.post('/addresses', addressData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create address');
  }
};

export const getUserAddresses = async (userId) => {
  try {
    const response = await api.get(`/addresses/user/${userId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getUserAddressesByType = async (userId, type) => {
  try {
    const response = await api.get(`/addresses/user/${userId}/type/${type}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update address');
  }
};

export const deleteAddress = async (addressId) => {
  try {
    await api.delete(`/addresses/${addressId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete address');
  }
};

export const setDefaultAddress = async (addressId) => {
  try {
    const response = await api.patch(`/addresses/${addressId}/set-default`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to set default address');
  }
};

// Order Management
export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get order');
  }
};

export const getOrdersByStatus = async (status) => {
  try {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await api.delete(`/orders/${orderId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete order');
  }
};

export const getOrderTotal = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/total`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get order total');
  }
};

// Order Items Management
export const getAllOrderItems = async () => {
  try {
    const response = await api.get('/order-items');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getOrderItemById = async (orderItemId) => {
  try {
    const response = await api.get(`/order-items/${orderItemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get order item');
  }
};

export const getOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/order-items/order/${orderId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createOrderItem = async (orderItemData) => {
  try {
    const response = await api.post('/order-items', orderItemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order item');
  }
};

export const updateOrderItem = async (orderItemId, orderItemData) => {
  try {
    const response = await api.put(`/order-items/${orderItemId}`, orderItemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order item');
  }
};

export const deleteOrderItem = async (orderItemId) => {
  try {
    await api.delete(`/order-items/${orderItemId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete order item');
  }
};

// Cart Management
export const getCartItems = async (userId) => {
  try {
    const response = await api.get(`/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getCartItemById = async (cartItemId) => {
  try {
    const response = await api.get(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get cart item');
  }
};

export const addToCartAPI = async (cartItemData) => {
  try {
    const response = await api.post('/cart', cartItemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add to cart');
  }
};

export const updateCartItem = async (cartItemId, cartItemData) => {
  try {
    const response = await api.put(`/cart/${cartItemId}`, cartItemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update cart item');
  }
};

export const removeFromCartAPI = async (cartItemId) => {
  try {
    await api.delete(`/cart/${cartItemId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove from cart');
  }
};

export const clearCartAPI = async (userId) => {
  try {
    await api.delete(`/cart/user/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear cart');
  }
};

export const getCartTotal = async (userId) => {
  try {
    const response = await api.get(`/cart/user/${userId}/total`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get cart total');
  }
};

// Payment Management
export const getAllPayments = async () => {
  try {
    const response = await api.get('/payments');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get payment');
  }
};

export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to process payment');
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await api.put(`/payments/${paymentId}`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update payment');
  }
};

export const deletePayment = async (paymentId) => {
  try {
    await api.delete(`/payments/${paymentId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete payment');
  }
};

export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// Product Image Management
export const getAllProductImages = async () => {
  try {
    const response = await api.get('/product-images');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getProductImageById = async (imageId) => {
  try {
    const response = await api.get(`/product-images/${imageId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get product image');
  }
};

export const getImagesByProductId = async (productId) => {
  try {
    const response = await api.get(`/product-images/product/${productId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createProductImage = async (imageData) => {
  try {
    const response = await api.post('/product-images', imageData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create product image');
  }
};

export const updateProductImage = async (imageId, imageData) => {
  try {
    const response = await api.put(`/product-images/${imageId}`, imageData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update product image');
  }
};

export const deleteProductImage = async (imageId) => {
  try {
    await api.delete(`/product-images/${imageId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete product image');
  }
};

// ==================== REVIEW API FUNCTIONS ====================

export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getProductRating = async (productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}/rating`);
    return response.data;
  } catch (error) {
    return { averageRating: 0, reviewCount: 0 };
  }
};

export const canUserReview = async (userId, productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}/can-review`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    return { canReview: false, hasReviewed: false };
  }
};

export const createReview = async (userId, productId, rating, comment = null) => {
  try {
    const response = await api.post('/reviews', { comment }, {
      params: { userId, productId, rating }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create review');
  }
};

export const updateReview = async (reviewId, userId, rating, comment) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, { rating, comment }, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update review');
  }
};

export const deleteReview = async (reviewId, userId) => {
  try {
    await api.delete(`/reviews/${reviewId}`, {
      params: { userId }
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

// ==================== ACCOUNT DELETION API FUNCTIONS ====================

export const requestAccountDeletion = async (reason) => {
  try {
    const response = await api.post('/users/request-deletion', { reason });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to request account deletion');
  }
};

export const cancelAccountDeletion = async () => {
  try {
    const response = await api.post('/users/cancel-deletion');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to cancel account deletion');
  }
};

export const getDeletionStatus = async () => {
  try {
    const response = await api.get('/users/deletion-status');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get deletion status');
  }
};
