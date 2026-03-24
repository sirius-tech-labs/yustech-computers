
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Menu, X, Truck, Bot, Search, Heart, LogIn, LogOut, Settings, ChevronDown, Package, Scale } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WHATSAPP_NUMBER } from '../constants';

import Logo from './Logo';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, wishlist } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Banner */}
      <div className="bg-brand-primary text-white py-2 text-center text-xs md:text-sm font-semibold flex items-center justify-center gap-2">
        <Truck size={16} />
        <span>🚚 Nationwide Laptop Delivery Across Nigeria — Fast &amp; Secure</span>
      </div>

      {/* Main Header Container */}
      <div className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Tier: Logo, Search, Actions */}
          <div className="flex justify-between items-center h-20 gap-4 md:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <Logo />
            </Link>

            {/* Global Search Bar (Desktop) */}
            <div className="hidden md:flex flex-grow max-w-2xl relative">
              <form onSubmit={handleSearch} className="w-full relative group shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <input
                  type="text"
                  placeholder="Search laptops, specifications, or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl py-3.5 pl-5 pr-14 outline-none transition-all text-sm font-medium text-gray-900"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Icons & Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <Link to="/finder" className="hidden lg:flex items-center gap-2 text-brand-primary text-xs font-black bg-emerald-50 px-4 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100 group">
                <Bot size={18} className="group-hover:animate-bounce" />
                <span className="uppercase tracking-widest">Smart Finder</span>
              </Link>

              <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

              <Link to="/wishlist" className="relative p-2 text-gray-500 hover:text-brand-primary hover:bg-emerald-50 rounded-xl transition-all">
                <Heart size={24} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-lg h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2 text-gray-500 hover:text-brand-primary hover:bg-emerald-50 rounded-xl transition-all">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-black rounded-lg h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth Button / User Avatar */}
              {user ? (
                <div className="relative ml-2" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(v => !v)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-full pl-1.5 pr-3 py-1.5 transition-colors"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-sm shadow-inner">
                        {(user.email || 'Y')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="hidden sm:flex flex-col items-start px-1">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider leading-none">Account</span>
                      {isAdmin && <span className="text-[9px] font-black uppercase text-brand-primary leading-none mt-0.5">Admin</span>}
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform origin-top-right animate-in fade-in scale-95 duration-200">
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                        <p className="font-black text-gray-900 text-sm truncate">{user.user_metadata?.full_name || 'Premium Member'}</p>
                        <p className="text-gray-500 text-[11px] font-medium truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-2">
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-brand-primary transition-colors">
                            <Settings size={18} /> Admin Console
                          </Link>
                        )}
                        <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-brand-primary transition-colors">
                          <Package size={18} /> Order History
                        </Link>
                        <Link to="/track" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-brand-primary transition-colors">
                          <Truck size={18} /> Track Delivery
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <button onClick={handleSignOut} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-black text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl font-black hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20 text-sm ml-2"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              )}

              <button onClick={toggleMenu} className="lg:hidden p-2 text-gray-600 ml-1">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Desktop Navigation Links */}
        <div className="hidden lg:block border-t border-gray-50 bg-gray-50/50 relative z-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 h-12">
              <Link to="/shop" className="text-gray-600 hover:text-brand-primary font-bold text-sm tracking-wide transition-colors">All Laptops</Link>
              <Link to="/shop?category=student" className="text-gray-600 hover:text-brand-primary font-bold text-sm tracking-wide transition-colors">Student Deals</Link>
              <Link to="/shop?category=business" className="text-gray-600 hover:text-brand-primary font-bold text-sm tracking-wide transition-colors">Business</Link>
              <Link to="/shop?category=gaming" className="text-gray-600 hover:text-brand-primary font-bold text-sm tracking-wide transition-colors">Gaming</Link>
              <Link to="/compare" className="flex items-center gap-1.5 text-gray-600 hover:text-brand-primary font-bold text-sm tracking-wide transition-colors">
                <Scale size={16} /> Compare
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-6">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-brand-primary transition-all text-sm font-medium text-gray-900"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-lg">
              <Search size={20} />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-4">
            <Link to="/" onClick={toggleMenu} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm">Home</Link>
            <Link to="/shop" onClick={toggleMenu} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm">Shop</Link>
            <Link to="/compare" onClick={toggleMenu} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm">Compare</Link>
            <Link to="/track" onClick={toggleMenu} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm">Track Order</Link>
            <Link to="/wishlist" onClick={toggleMenu} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm">Wishlist</Link>
            <Link to="/student-deals" onClick={toggleMenu} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm">Students</Link>
          </div>

          <Link to="/finder" onClick={toggleMenu} className="flex items-center justify-center gap-3 w-full bg-emerald-50 text-brand-primary py-4 rounded-2xl font-black border border-emerald-100">
            <Bot size={24} />
            <span>SMART FINDER</span>
          </Link>

          {/* Mobile Auth */}
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-black">
                    {(user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-black text-gray-900 text-sm">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={toggleMenu}
                  className="flex items-center justify-center gap-2 w-full bg-brand-primary text-white py-4 rounded-2xl font-black shadow-lg"
                >
                  <Settings size={20} />
                  <span>ADMIN PANEL</span>
                </Link>
              )}
              <Link
                to="/orders"
                onClick={toggleMenu}
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-800 py-4 rounded-2xl font-black"
              >
                <Package size={20} />
                <span>MY ORDERS</span>
              </Link>
              <button
                onClick={() => { handleSignOut(); toggleMenu(); }}
                className="flex items-center justify-center gap-2 w-full border-2 border-red-100 text-red-600 py-4 rounded-2xl font-black"
              >
                <LogOut size={20} />
                <span>SIGN OUT</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="flex items-center justify-center gap-2 bg-brand-primary text-white w-full py-4 rounded-2xl font-black shadow-lg"
            >
              <LogIn size={20} />
              <span>SIGN IN WITH GOOGLE</span>
            </Link>
          )}

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="flex items-center justify-center gap-2 bg-green-500 text-white w-full py-4 rounded-2xl font-black shadow-lg"
          >
            <MessageCircle size={24} />
            <span>CHAT ON WHATSAPP</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
