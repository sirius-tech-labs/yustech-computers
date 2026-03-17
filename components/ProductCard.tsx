
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Laptop } from '../types';
import { formatPrice } from '../constants';
import { ShoppingCart, Eye, ShieldCheck, Zap, Loader2, Maximize2, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailsModal from './ProductDetailsModal';

interface ProductCardProps {
  laptop: Laptop;
}

const ProductCard: React.FC<ProductCardProps> = ({ laptop }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const startTime = useRef(Date.now());
  const discount = Math.round((1 - laptop.price / laptop.originalPrice) * 100);

  const handleImageLoad = () => {
    const elapsed = Date.now() - startTime.current;
    const minimumDisplayTime = 500;

    if (elapsed < minimumDisplayTime) {
      setTimeout(() => setImageLoaded(true), minimumDisplayTime - elapsed);
    } else {
      setImageLoaded(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all group overflow-hidden flex flex-col h-full relative hover:shadow-xl border-b-4 border-b-transparent hover:border-b-brand-primary">
        {/* Sale Tag */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Zap size={10} fill="currentColor" />
            {discount}% OFF
          </div>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(laptop); }}
            className={`p-2 rounded-full shadow-lg transition-all active:scale-90 flex items-center gap-1 ${isInWishlist(laptop.id)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-400 hover:text-red-500'
              }`}
          >
            <Heart size={14} fill={isInWishlist(laptop.id) ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase">wish</span>
          </button>
        </div>

        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden block">
          <Link to={`/product/${laptop.id}`} className="absolute inset-0">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-0">
                <Loader2 className="w-6 h-6 text-brand-primary animate-spin opacity-20" />
              </div>
            )}
            <img
              src={laptop.image || undefined}
              alt={laptop.name}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000";
              }}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
            <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-[9px] uppercase font-black px-2 py-1 rounded shadow-sm">
              {laptop.condition}
            </span>
            {laptop.isBestForSchool && (
              <span className="bg-emerald-500 text-white text-[9px] uppercase font-black px-2 py-1 rounded shadow-sm">
                Best for School
              </span>
            )}
          </div>

          {/* Hover Overlay - Removed Backdrop Blur */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-primary/10 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickView(true); }}
              className="bg-white text-brand-primary px-4 py-2 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-emerald-50 transition active:scale-95"
            >
              <Maximize2 size={16} /> Quick View
            </button>
            <Link to={`/product/${laptop.id}`} className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-brand-dark transition active:scale-95">
              <Eye size={16} /> View Details
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <Link to={`/product/${laptop.id}`} className="block mb-2">
            <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-brand-primary transition-colors">
              {laptop.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs font-bold mb-4 uppercase tracking-tighter">{laptop.specs}</p>

          <div className="mt-auto">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-brand-primary text-2xl font-black">{formatPrice(laptop.price)}</span>
              <span className="text-sm text-gray-400 line-through font-bold opacity-60">{formatPrice(laptop.originalPrice)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => { e.preventDefault(); addToCart(laptop); }}
                className="flex items-center justify-center gap-2 bg-brand-primary text-white py-2.5 rounded-xl text-xs font-black hover:bg-brand-dark transition shadow-lg active:scale-95"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>
              <Link
                to={`/product/${laptop.id}`}
                className="flex items-center justify-center gap-2 border-2 border-gray-100 py-2.5 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition"
              >
                <Eye size={14} />
                Details
              </Link>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <ShieldCheck size={12} className="text-green-500" />
              Tested & Trusted
            </div>
          </div>
        </div>
      </div>
      {showQuickView && (
        <ProductDetailsModal laptop={laptop} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default ProductCard;
