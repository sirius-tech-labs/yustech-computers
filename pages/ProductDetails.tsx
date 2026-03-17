
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LAPTOPS, formatPrice, WHATSAPP_NUMBER } from '../constants';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  CheckCircle,
  Info,
  MessageCircle,
  Clock,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Video,
  Users,
  Eye
} from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToRecentlyViewed, inventory, isInventoryLoading } = useCart();

  const laptop = useMemo(() => {
    // Try finding in inventory first
    const found = inventory.find(l => l.id === id);
    if (found) return found;
    // Fallback to constants if not in inventory (e.g. during loading or if DB missing items)
    return LAPTOPS.find(l => l.id === id);
  }, [inventory, id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 15) + 5);

  const relatedProducts = useMemo(() => {
    if (!laptop) return [];
    return inventory
      .filter(l => l.category === laptop.category && l.id !== laptop.id)
      .slice(0, 4);
  }, [laptop, inventory]);

  useEffect(() => {
    if (laptop) {
      setCurrentIndex(0);
      window.scrollTo(0, 0);
      addToRecentlyViewed(laptop);
    }
  }, [id, addToRecentlyViewed, laptop]); // Use id to ensure it only scrolls on navigation

  if (isInventoryLoading && !laptop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Loading Product Details...</p>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="text-brand-primary font-bold flex items-center gap-2 mx-auto">
          <ArrowLeft size={18} /> Back to Shop
        </button>
      </div>
    );
  }

  const allImages = [laptop.image, ...(laptop.moreImages || [])];
  const discount = Math.round((1 - laptop.price / laptop.originalPrice) * 100);

  const slide = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Helmet>
        <title>{laptop.name} | Yustech Logic System Service Nigeria</title>
        <meta name="description" content={`${laptop.name} - ${laptop.specs}. ${laptop.description?.substring(0, 150)}...`} />
        <meta property="og:title" content={`${laptop.name} | Yustech Logic System Service`} />
        <meta property="og:image" content={laptop.image} />
      </Helmet>
      {/* Breadcrumb & Back */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-bold transition group mb-8"
        >
          <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition">
            <ArrowLeft size={20} />
          </div>
          Go Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Gallery Slider & Content */}
          <div className="lg:col-span-7 space-y-12">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group">
              <img
                src={allImages[currentIndex] || undefined}
                alt={laptop.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500"
              />

              {/* Slider Controls */}
              <button
                onClick={() => slide('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition flex items-center justify-center text-brand-primary z-20 active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => slide('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition flex items-center justify-center text-brand-primary z-20 active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute top-5 left-5 flex flex-col gap-2 pointer-events-none">
                <span className="bg-brand-dark/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">
                  {laptop.condition}
                </span>
                {laptop.isBestForSchool && (
                  <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">
                    Recommended for Students
                  </span>
                )}
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/20 p-2 rounded-full backdrop-blur-md">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === i ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              {allImages.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-[1.5rem] overflow-hidden border-2 transition-all ${currentIndex === i ? 'border-brand-primary scale-95 shadow-lg' : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'}`}
                >
                  <img
                    src={img || undefined}
                    alt={`${laptop.name} ${i}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Description (Moved to Left) */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-900">
                <Info size={24} className="text-brand-primary" /> Why you'll love this laptop
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium md:text-lg">
                {laptop.description}
              </p>
            </div>

            {/* Technical Specs (Moved to Left) */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-900">
                <Zap size={24} className="text-yellow-500" /> Full Technical Specs
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {laptop.detailedSpecs?.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 text-base font-bold text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                    <CheckCircle size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Video Showcase */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-900">
                <Video size={24} className="text-red-600" /> Watch in Action
              </h3>
              {laptop.youtubeUrl ? (
                <div className="aspect-video rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl">
                  <iframe
                    src={laptop.youtubeUrl}
                    title={`${laptop.name} Video Review`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video bg-gray-900 rounded-[2rem] overflow-hidden relative group cursor-pointer border border-gray-100 shadow-xl">
                  <img
                    src={laptop.image || undefined}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700"
                    alt="Video thumbnail"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
                    <div className="w-20 h-20 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-4 border-white/20">
                      <Play size={32} fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-black text-2xl uppercase tracking-tighter mb-2 drop-shadow-md">Video Review Coming Soon</p>
                      <p className="text-sm text-gray-300 font-bold italic max-w-sm mx-auto">Our engineers are currently filming a detailed performance test for this unit.</p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Ikeja Store Exclusive</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sticky Action Panel */}
          <div className="lg:col-span-5 flex flex-col sticky top-28 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-brand-primary mb-4 bg-brand-primary/10 w-fit px-3 py-1.5 rounded-lg">
                  <Star size={14} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Premium Collection</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tighter">
                  {laptop.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <p className="bg-gray-100 px-3 py-1.5 rounded-lg">{laptop.brand} Professional</p>
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                    <Users size={14} />
                    <span>{viewers} viewing now</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl mb-6 border border-gray-100/80">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl lg:text-5xl font-black text-brand-primary tracking-tighter">{formatPrice(laptop.price)}</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg text-gray-400 line-through font-bold">{formatPrice(laptop.originalPrice)}</span>
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">-{discount}% OFF</span>
                  <span className="text-red-500 text-[10px] font-black animate-pulse uppercase tracking-widest bg-red-50 px-2 py-1 rounded-md">Limited Stock!</span>
                </div>

                <button
                  onClick={() => addToCart(laptop)}
                  className="w-full bg-brand-primary text-white py-4 md:py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(0,135,81,0.25)] hover:bg-brand-dark hover:-translate-y-1 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart size={24} />
                  Add to My Cart
                </button>
              </div>

              {/* Nigerian Trust Badges (Moved to Right Panel) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 mb-6">
                <div className="bg-emerald-50/50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100/50">
                  <div className="bg-white p-2 rounded-xl shadow-sm"><ShieldCheck className="text-emerald-600" size={20} /></div>
                  <div>
                    <p className="font-black text-xs text-gray-900">Tested & Clean</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">10-Point Check</p>
                  </div>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-3 border border-blue-100/50">
                  <div className="bg-white p-2 rounded-xl shadow-sm"><Truck className="text-brand-primary" size={20} /></div>
                  <div>
                    <p className="font-black text-xs text-gray-900">Swift Delivery</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Nationwide</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-red-50 rounded-2xl border border-red-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="flex items-center gap-2 text-red-600 font-black uppercase text-xs mb-2 relative z-10">
                  <Clock size={16} /> Urgent Notice
                </div>
                <p className="text-red-700/80 text-xs font-bold leading-relaxed relative z-10">
                  Only 2 units left in our Ikeja store. We deliver laptops safely anywhere in Nigeria. Secure yours now!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-50">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">You May Also Like</h2>
              <div className="h-1.5 w-16 bg-brand-dark rounded-full mt-2"></div>
            </div>
            <Link to="/shop" className="text-brand-primary font-black text-sm uppercase tracking-widest hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} laptop={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
