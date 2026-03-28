
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LAPTOPS, formatPrice } from '../constants';
import { Category } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, Search as SearchIcon, X, History, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

type PriceRange = 'all' | 'under200' | '200to400' | '400to700' | 'above700';
type RamFilter = '4GB' | '8GB' | '16GB' | '32GB';

const PRICE_RANGES: { id: PriceRange; label: string; min: number; max: number }[] = [
  { id: 'all', label: 'Any Price', min: 0, max: Infinity },
  { id: 'under200', label: 'Under ₦200k', min: 0, max: 200000 },
  { id: '200to400', label: '₦200k – ₦400k', min: 200000, max: 400000 },
  { id: '400to700', label: '₦400k – ₦700k', min: 400000, max: 700000 },
  { id: 'above700', label: '₦700k+', min: 700000, max: Infinity },
];

const RAM_OPTIONS: RamFilter[] = ['4GB', '8GB', '16GB', '32GB'];

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc'>('default');
  const { recentlyViewed, inventory, isInventoryLoading } = useCart();

  // Advanced filter state
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRam, setSelectedRam] = useState<RamFilter[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'UK-Used' | 'New'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    brand: true,
    ram: true,
    condition: true,
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Dynamically extract brands from inventory
  const availableBrands = useMemo(() => {
    const brands = new Set(inventory.map(l => l.brand));
    return Array.from(brands).sort();
  }, [inventory]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceRange !== 'all') count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (selectedRam.length > 0) count += selectedRam.length;
    if (selectedCondition !== 'all') count++;
    return count;
  }, [priceRange, selectedBrands, selectedRam, selectedCondition]);

  const clearAllFilters = () => {
    setPriceRange('all');
    setSelectedBrands([]);
    setSelectedRam([]);
    setSelectedCondition('all');
    setActiveCategory('All');
    setSearchTerm('');
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleRam = (ram: RamFilter) => {
    setSelectedRam(prev =>
      prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Extract RAM from specs string
  const extractRam = (specs: string): string | null => {
    const match = specs.match(/(\d+)\s*GB/i);
    return match ? `${match[1]}GB` : null;
  };

  const filteredLaptops = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const priceConfig = PRICE_RANGES.find(p => p.id === priceRange)!;

    return inventory.filter(l => {
      const matchesCat = activeCategory === 'All' || l.category === activeCategory;

      const matchesSearch =
        l.name.toLowerCase().includes(searchLower) ||
        l.specs.toLowerCase().includes(searchLower) ||
        l.brand.toLowerCase().includes(searchLower) ||
        l.category.toLowerCase().includes(searchLower) ||
        l.description?.toLowerCase().includes(searchLower);

      const matchesPrice = l.price >= priceConfig.min && l.price <= priceConfig.max;

      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(l.brand);

      const laptopRam = extractRam(l.specs);
      const matchesRam = selectedRam.length === 0 || (laptopRam && selectedRam.includes(laptopRam as RamFilter));

      const matchesCondition = selectedCondition === 'all' || l.condition === selectedCondition;

      return matchesCat && matchesSearch && matchesPrice && matchesBrand && matchesRam && matchesCondition;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });
  }, [activeCategory, searchTerm, sortBy, inventory, priceRange, selectedBrands, selectedRam, selectedCondition]);

  // Filter panel component (shared between desktop sidebar and mobile drawer)
  const FilterPanelContent = () => (
    <div className="space-y-6">
      {/* Active filter count & clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-2 w-full text-sm text-red-600 font-bold bg-red-50 px-4 py-3 rounded-xl hover:bg-red-100 transition-colors"
        >
          <RotateCcw size={14} />
          Clear All Filters ({activeFilterCount})
        </button>
      )}

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Budget Range</span>
          {expandedSections.price ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            {PRICE_RANGES.map(range => (
              <button
                key={range.id}
                onClick={() => setPriceRange(range.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${priceRange === range.id
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-brand-primary'
                  }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Brand</span>
          {expandedSections.brand ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </button>
        {expandedSections.brand && (
          <div className="flex flex-wrap gap-2">
            {availableBrands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${selectedBrands.includes(brand)
                    ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-brand-primary/30'
                  }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RAM */}
      <div>
        <button
          onClick={() => toggleSection('ram')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">RAM Size</span>
          {expandedSections.ram ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </button>
        {expandedSections.ram && (
          <div className="flex flex-wrap gap-2">
            {RAM_OPTIONS.map(ram => (
              <button
                key={ram}
                onClick={() => toggleRam(ram)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${selectedRam.includes(ram)
                    ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-brand-primary/30'
                  }`}
              >
                {ram}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Condition */}
      <div>
        <button
          onClick={() => toggleSection('condition')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Condition</span>
          {expandedSections.condition ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </button>
        {expandedSections.condition && (
          <div className="space-y-2">
            {(['all', 'UK-Used', 'New'] as const).map(cond => (
              <button
                key={cond}
                onClick={() => setSelectedCondition(cond)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCondition === cond
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-brand-primary'
                  }`}
              >
                {cond === 'all' ? 'All Conditions' : cond}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet>
        <title>Shop | Yustech Logic System Catalog</title>
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

            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center justify-center gap-2 py-3.5 px-5 bg-gray-900 text-white rounded-xl font-bold text-sm relative"
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </button>
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

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <FilterPanelContent />
            </div>
            <div className="sticky bottom-0 p-5 bg-white border-t border-gray-100">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-black text-sm shadow-lg"
              >
                Show {filteredLaptops.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 pl-0">

        {/* Left Side: Desktop Filter Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0 order-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-40">
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-brand-primary" /> Advanced Filters
            </h3>
            <FilterPanelContent />
          </div>
        </div>

        {/* Center: Product Grid */}
        <div className="flex-grow order-2">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 font-bold">
              {isInventoryLoading && inventory.length <= 13
                ? 'Loading...'
                : `${filteredLaptops.length} laptop${filteredLaptops.length !== 1 ? 's' : ''} found`
              }
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-brand-primary font-black uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} /> Clear filters
              </button>
            )}
          </div>

          {isInventoryLoading && inventory.length <= 13 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredLaptops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                onClick={clearAllFilters}
                className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-primary transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Recently Viewed & Finder Promo */}
        <div className="w-full lg:w-64 flex-shrink-0 order-3 space-y-6">
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
