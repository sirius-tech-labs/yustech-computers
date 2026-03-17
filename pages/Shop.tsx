
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LAPTOPS, formatPrice } from '../constants';
import { Category } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, Search as SearchIcon, X, History } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc'>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { recentlyViewed, inventory, isInventoryLoading } = useCart();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const filteredLaptops = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return inventory.filter(l => {
      const matchesCat = activeCategory === 'All' || l.category === activeCategory;

      // Improved search logic: check name, specs, brand, and category
      const matchesSearch =
        l.name.toLowerCase().includes(searchLower) ||
        l.specs.toLowerCase().includes(searchLower) ||
        l.brand.toLowerCase().includes(searchLower) ||
        l.category.toLowerCase().includes(searchLower) ||
        l.description?.toLowerCase().includes(searchLower);

      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });
  }, [activeCategory, searchTerm, sortBy, inventory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet>
        <title>Shop | Yustech Logic System Service Catalog</title>
        <meta name="description" content="Browse our wide range of UK-used and new laptops at Yustech. Filter by category: Student, Business, Gaming, and more. Best prices in Nigeria." />
      </Helmet>
      {/* Header and Controls */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-100 mb-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Explore Collection</h1>
            <p className="text-gray-500 mt-2 font-medium">Premium laptops curated for your needs.</p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow md:w-72">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search laptops, specs, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-xl focus:ring-0 outline-none transition-all text-sm font-semibold text-gray-900"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 p-1 bg-gray-200 rounded-full">
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-3.5 px-5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-brand-primary/20 outline-none font-bold text-sm text-gray-700 transition-all appearance-none cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
          <span className="text-sm font-black text-gray-400 uppercase tracking-widest mr-2 flex-shrink-0 flex items-center gap-2">
            <Filter size={16} /> Filter:
          </span>
          {['All', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-black transition-all border-2 flex-shrink-0 ${activeCategory === cat
                  ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105'
                  : 'bg-white border-gray-100 text-gray-600 hover:border-brand-primary/30 hover:bg-emerald-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 pl-0">
        {/* Left Side: Product Grid (Takes more space now) */}
        <div className="flex-grow order-2 lg:order-1">
          {isInventoryLoading && inventory.length <= 13 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredLaptops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLaptops.map(laptop => (
                <ProductCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No laptops found</h3>
              <p className="text-gray-500 font-medium">Try adjusting your filters or search term to find what you're looking for.</p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
                className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-primary transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Recently Viewed & Finder Promo (Much narrower) */}
        <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2 space-y-6">
          {/* Smart Finder Promo */}
          <div className="bg-brand-dark rounded-2xl p-6 text-white text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <span className="bg-white/10 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 mb-4 inline-block">Need Advice?</span>
              <h4 className="font-black text-lg mb-2">Not sure what to buy?</h4>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">Let our Smart Finder ask you a few questions and recommend the perfect laptop.</p>
              <Link to="/finder" className="block w-full bg-brand-primary text-white py-3 rounded-xl text-sm font-black hover:bg-emerald-500 transition-colors shadow-lg">
                Start Smart Finder
              </Link>
            </div>
          </div>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <History size={16} /> Recently Viewed
              </h3>
              <div className="space-y-4">
                {recentlyViewed.slice(0, 4).map(l => (
                  <Link key={l.id} to={`/product/${l.id}`} className="flex gap-4 items-center group">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
                      <img src={l.image || undefined} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="overflow-hidden flex-grow">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-brand-primary transition-colors">{l.name}</p>
                      <p className="text-[11px] font-black text-brand-primary mt-1">{formatPrice(l.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Shop;
