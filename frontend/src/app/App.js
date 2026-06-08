import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AdminProductFormPage } from './pages/AdminProductFormPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminUserFormPage } from './pages/AdminUserFormPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminCategoryFormPage } from './pages/AdminCategoryFormPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { Contact } from './pages/Contact';
import { Shipping } from './pages/Shipping';
import { Returns } from './pages/Returns';
import { FAQ } from './pages/FAQ';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <CartSidebar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/product/new" element={<AdminProductFormPage />} />
            <Route path="/admin/product/:id" element={<AdminProductFormPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/user/new" element={<AdminUserFormPage />} />
            <Route path="/admin/user/:id" element={<AdminUserFormPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/category/new" element={<AdminCategoryFormPage />} />
            <Route path="/admin/category/:id" element={<AdminCategoryFormPage />} />
          </Routes>
        </main>
        
          <Footer />
        </div>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}