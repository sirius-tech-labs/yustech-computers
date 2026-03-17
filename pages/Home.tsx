
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronRight, ChevronLeft, CheckCircle2, Star, ShieldCheck, MapPin, Zap, Verified, Truck, MessageCircle, Cpu, Gem, Wind } from 'lucide-react';
import { LAPTOPS, TESTIMONIALS, formatPrice } from '../constants';
import { Category } from '../types';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { CategoryCarouselSkeleton, SidebarSkeleton } from '../components/LoadingSkeleton';

const CategoryCarousel: React.FC<{ title: string; category: Category }> = ({ title, category }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { inventory, isInventoryLoading } = useCart();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by approximately 80% of the container width for a smooth, logical skip
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const filteredLaptops = inventory.filter(l => l.category === category);

  if (inventory.length === 0 && !isInventoryLoading) return null;

  return (
    <section className="relative group/carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                {title}
              </h2>
              <span className="text-[9px] md:text-[10px] bg-red-100 text-red-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-black uppercase tracking-tighter whitespace-nowrap">
                Fast Moving
              </span>
            </div>
            <div className="h-1.5 md:h-2 w-16 md:w-20 bg-brand-primary rounded-full"></div>
          </div>
          <Link to="/shop" className="text-brand-primary font-black text-xs md:text-sm flex items-center gap-1 hover:underline group uppercase tracking-widest whitespace-nowrap pb-1">
            Browse All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Navigation Buttons - Visible on all screens for better UX */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-3 md:p-4 rounded-full shadow-2xl text-brand-primary hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center border border-gray-100 active:scale-90"
          aria-label="Previous items"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-3 md:p-4 rounded-full shadow-2xl text-brand-primary hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center border border-gray-100 active:scale-90"
          aria-label="Next items"
        >
          <ChevronRight size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-8 pb-12 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {filteredLaptops.map(laptop => (
            <div key={laptop.id} className="flex-shrink-0 w-[280px] sm:w-[350px] snap-start">
              <ProductCard laptop={laptop} />
            </div>
          ))}
          <Link
            to="/shop"
            className="flex-shrink-0 w-60 md:w-64 bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 hover:bg-gray-100 transition group snap-start"
          >
            <div className="bg-white p-5 md:p-6 rounded-full shadow-lg text-brand-primary group-hover:scale-110 transition-transform">
              <ChevronRight size={32} className="md:w-10 md:h-10" />
            </div>
            <span className="font-black text-gray-400 uppercase tracking-widest text-xs md:text-sm text-center px-4">See all {title}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const { inventory, isInventoryLoading } = useCart();
  const categories = [
    { title: "Student Laptops", cat: Category.STUDENT },
    { title: "Business & Work", cat: Category.BUSINESS },
    { title: "Programming Powerhouses", cat: Category.PROGRAMMING },
    { title: "Gaming Monsters", cat: Category.GAMING },
    { title: "Premium Selection", cat: Category.PREMIUM },
    { title: "Budget Friendly", cat: Category.BUDGET },
  ];

  const hotToday = inventory.slice(0, 3);

  return (
    <div className="bg-[#f1f1f2] md:pb-20 overflow-x-hidden">
      <Helmet>
        <title>Yustech Logic System Service | Premium Tech Store Nigeria</title>
        <meta name="description" content="Buy affordable, high-quality UK-used and new laptops at Yustech Logic System Service. Nationwide delivery, tested hardware, and trusted service." />
      </Helmet>

      {/* SaaS/Education Style Bright Hero Section */}
      <section className="bg-white relative overflow-hidden mb-16 pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Subtle decorative background elements */}
        <div className="absolute top-20 right-20 w-8 h-8 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 22M2 12L22 12M5 5L19 19M5 19L19 5" stroke="#008751" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-10 w-12 h-12 opacity-15">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="#f68b1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left side text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start animate-fade-in-up relative z-10">

              {/* Highlight badge similar to image */}


              <h1 className="text-5xl lg:text-[4.5rem] font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                The Best <br className="hidden lg:block" />
                <span className="text-gray-900 inline-block">Platform to Upgrade</span> <br className="hidden lg:block" />
                <span className="text-gray-900 inline-block">Your Digital Arsenal</span>
              </h1>

              <p className="text-gray-500 text-lg md:text-xl font-medium mb-10 max-w-xl leading-relaxed lg:mx-0 mx-auto">
                "Our mission is to help Nigerian professionals, students, and gamers find premium Grade A+ UK-Used and brand new laptops with nationwide delivery."
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/shop" className="bg-[#2D2852] text-white px-8 py-4 rounded font-bold text-base transition-all hover:bg-brand-primary flex items-center justify-center gap-3">
                  Get Start Now <ChevronRight size={18} />
                </Link>
                <Link to="/finder" className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-4 rounded font-bold text-base transition-all hover:border-gray-900 flex items-center justify-center">
                  AI HELPER
                </Link>
              </div>
            </div>

            {/* Desktop-only Image & abstractions */}
            <div className="hidden lg:flex lg:w-1/2 relative justify-center items-end animate-fade-in-up animation-delay-200 z-10">
              {/* Decorative "butterfly/wing" shapes behind person */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] -z-10 pointer-events-none opacity-40">
                <svg viewBox="0 0 200 200" className="w-[120%] h-full absolute top-[10%] -left-[10%] fill-transparent stroke-[#fca5a5] stroke-[1px]">
                  <path d="M100 100 C 50 150, 0 100, 50 50 C 100 0, 150 50, 100 100 Z" />
                  <path d="M100 100 C 150 150, 200 100, 150 50 C 100 0, 50 50, 100 100 Z" />
                  <path d="M100 100 C 50 200, 0 150, 50 100" />
                  <path d="M100 100 C 150 200, 200 150, 150 100" />
                </svg>
              </div>

              {/* The generated image formatted as a cutout with no dark bg */}
              <div className="relative z-10 w-full max-w-[500px]">
                <div className="relative outline-none">
                  <img
                    src="/hero-bg.png"
                    alt="Yustech Professional"
                    className="w-full h-auto object-cover rounded-t-full rounded-b-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white aspect-[4/5]"
                  />
                  {/* Decorative floating icon */}
                  <div className="absolute top-10 right-0 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center -rotate-12 animate-float">
                    <span className="text-2xl">💬</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-only Background Image */}
            <div className="absolute inset-0 lg:hidden pointer-events-none z-0">
              <img
                src="/hero-bg.png"
                alt=""
                className="w-full h-full object-cover opacity-[1.0] mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-white/90"></div>
            </div>
          </div>

          {/* Trust logos bottom strip matching image reference */}
          <div className="mt-28 flex flex-col items-center animate-fade-in-up animation-delay-300">
            <p className="text-[13px] font-bold text-gray-800 mb-8 mx-auto text-center tracking-widest uppercase">Trusted by 4,000+ Students & Professionals from</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-90 md:opacity-100 transition-all duration-500">

              <div className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tighter">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-blue-900 text-white font-serif text-sm">UI</div>
                Univ. of Ibadan
              </div>

              <div className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tighter">
                <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-serif text-xs">UNILAG</div>
                UNILAG
              </div>

              <div className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tighter">
                <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white">
                  <Cpu size={18} />
                </div>
                Sirius Tech Labs
              </div>

              <div className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tighter">
                <div className="w-8 h-8 rounded bg-pink-500 flex items-center justify-center text-white">
                  <Gem size={18} />
                </div>
                Diamond District
              </div>

              <div className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tighter">
                <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-white">
                  <Wind size={18} />
                </div>
                Wings.com
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Modern Category Grid */}
      < section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:-mt-24 relative z-20" >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${cat.cat}`}
              className="bg-white p-4 md:p-6 rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100/50 flex flex-col items-center justify-center text-center group"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-brand-primary mb-3 group-hover:bg-brand-primary group-hover:text-white transition-colors shadow-inner">
                <Search size={20} />
              </div>
              <span className="text-xs md:text-sm font-black text-gray-800 leading-tight group-hover:text-brand-primary transition-colors">{cat.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sales Style Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="bg-red-600 text-white p-6 md:p-8 flex flex-col justify-center items-start md:w-64 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={28} className="fill-white" />
              <h2 className="font-black italic uppercase tracking-tighter text-2xl">Flash Sale</h2>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-xl mb-6 w-full text-center">
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Ends In</p>
              <p className="text-xl md:text-2xl font-black tabular-nums tracking-wider">04:12:09</p>
            </div>
            <Link to="/shop" className="text-white hover:text-red-100 text-sm font-black uppercase tracking-widest flex items-center gap-2 group transition-colors">
              View All Offers <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="p-6 md:p-8 overflow-x-auto hide-scrollbar flex-grow bg-slate-50">
            <div className="flex gap-4 min-w-max">
              {hotToday.map(l => (
                <Link to={`/product/${l.id}`} key={l.id} className="w-48 md:w-56 bg-white p-3 md:p-4 rounded-2xl hover:shadow-2xl transition-all border border-gray-100 group">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 relative">
                    <img src={l.image} alt={l.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">-30%</div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 truncate mb-2">{l.name}</h4>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-brand-primary">{formatPrice(l.price)}</span>
                    <span className="text-xs text-gray-400 line-through font-bold">{formatPrice(l.originalPrice)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Display */}
      <div className="space-y-12 md:space-y-16">
        {isInventoryLoading && inventory.length <= 13 ? (
          <>
            <CategoryCarouselSkeleton />
            <CategoryCarouselSkeleton />
          </>
        ) : (
          categories.map((cat, idx) => (
            <CategoryCarousel key={idx} title={cat.title} category={cat.cat} />
          ))
        )}
      </div >

      {/* Trust & Psychological Purchase Triggers Section */}
      < section className="bg-brand-dark text-white py-16 md:py-24 mb-16 relative overflow-hidden" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black mb-3">10-Point Tested</h3>
              <p className="text-sm text-emerald-100/70">Every machine undergoes rigorous engineering checks before it reaches you.</p>
            </div>
            <div className="flex flex-col items-center bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Zap size={32} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-black mb-3">Grade A+ UK-Used</h3>
              <p className="text-sm text-emerald-100/70">Direct premium imports. No poorly refurbished local units.</p>
            </div>
            <div className="flex flex-col items-center bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-black mb-3">Nationwide Delivery</h3>
              <p className="text-sm text-emerald-100/70">Safe, trackable, and insured logistics to anywhere in Nigeria.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </section >

      {/* Trust Section Wrapper */}
      < div className="bg-white py-16 md:py-24" >

        {/* Nationwide Delivery Promo */}
        < section className="bg-gray-50 py-16 md:py-20 mb-16 md:mb-24" >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 tracking-tight uppercase italic underline decoration-brand-primary/20">Safely Delivered Anywhere in Nigeria</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-10 md:mb-14 text-base md:text-lg font-medium">
              Professional packaging for professional equipment. We use secure double-bubble wrapping and trackable logistics to ensure your tech arrives in pristine condition.
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {['Lagos', 'Abuja', 'Ibadan', 'Osogbo', 'Port Harcourt', 'Benin', 'Enugu', 'Kaduna', 'Jos'].map(city => (
                <span key={city} className="bg-white px-4 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl shadow-sm text-xs md:text-sm font-black text-gray-700 border border-gray-200 uppercase tracking-tighter hover:bg-brand-primary hover:text-white transition cursor-default">
                  {city}
                </span>
              ))}
              <span className="bg-brand-primary text-white px-4 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl shadow-xl text-xs md:text-sm font-black uppercase tracking-tighter">
                + All 36 states
              </span>
            </div>
          </div>
        </section >

        {/* Reviews */}
        < section className="max-w-7xl mx-auto px-4" >
          <h2 className="text-3xl md:text-4xl font-black mb-10 md:mb-16 text-center tracking-tight uppercase italic">What Nigerians Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {TESTIMONIALS.slice(0, 6).map(t => (
              <div key={t.id} className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 text-emerald-400 mb-6 md:mb-8">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-gray-700 mb-8 md:mb-10 font-bold italic text-lg md:text-xl leading-relaxed">"{t.text}"</p>
                <div className="mt-auto border-t border-gray-50 pt-6 md:pt-8 flex items-center justify-between">
                  <div>
                    <p className="font-black text-gray-900 text-base md:text-lg tracking-tighter">{t.name}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.location}, Nigeria</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 md:px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black flex items-center gap-1.5 shadow-sm border border-green-200">
                    <Verified size={12} /> VERIFIED BUYER
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section >
      </div >
    </div >
  );
};

export default Home;
