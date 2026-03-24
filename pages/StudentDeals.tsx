
import React from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

const StudentDeals: React.FC = () => {
  const { inventory } = useCart();
  const studentLaptops = inventory.filter(l => l.isBestForSchool || l.price < 250000);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-emerald-500 rounded-3xl p-8 md:p-16 text-white mb-16 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <GraduationCap size={16} /> Best for Nigerian Students
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Smart Choices for Smarter Students</h1>
          <p className="text-lg text-emerald-50 opacity-90 mb-8">
            Get high-performance laptops tested for academic excellence. From Zoom classes to complex assignments, we've got you covered with budget-friendly prices.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl border border-white/20"><BookOpen size={18} /> <span>Free Support</span></div>
            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl border border-white/20"><Award size={18} /> <span>Verified UK-Used</span></div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 -mr-10 -mb-10 transform -rotate-12 hidden lg:block">
          <GraduationCap size={400} />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Recommended for School</h2>
        <p className="text-gray-500">Laptops that balance performance and portability perfectly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentLaptops.map(laptop => (
          <ProductCard key={laptop.id} laptop={laptop} />
        ))}
      </div>

      <div className="mt-20 bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Join the Yustech Logic System Community</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          We've helped over 5,000 Nigerian students get reliable laptops for their studies. Your academic success starts with the right tool.
        </p>
        <div className="text-brand-dark font-black text-xl">We deliver laptops safely anywhere in Nigeria.</div>
      </div>
    </div>
  );
};

export default StudentDeals;
