
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import WhatsAppBubble from './components/WhatsAppBubble';
import PullToRefresh from './components/PullToRefresh';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Finder = lazy(() => import('./pages/Finder'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const StudentDeals = lazy(() => import('./pages/StudentDeals'));
const BulkOrders = lazy(() => import('./pages/BulkOrders'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const UserOrders = lazy(() => import('./pages/UserOrders'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Compare = lazy(() => import('./pages/Compare'));
const Blog = lazy(() => import('./pages/Blog'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AppContent: React.FC = () => {
  const { isPullToRefreshDisabled } = useCart();

  const handleRefresh = async () => {
    // Simulate a network delay or data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <Router>
      <ScrollToTop />
      <PullToRefresh onRefresh={handleRefresh} disabled={isPullToRefreshDisabled}>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/finder" element={<Finder />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/student-deals" element={<StudentDeals />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
                <Route path="/orders" element={<UserOrders />} />
                <Route path="/track" element={<OrderTracking />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <Admin />
                    </ProtectedAdminRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <BackToTop />
          <WhatsAppBubble />
        </div>
      </PullToRefresh>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
