import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { wishlist } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh]">
      <Helmet>
        <title>My Wishlist | Yustech Logic System Service</title>
        <meta name="description" content="View and manage your favorite laptops at Yustech Logic System Service." />
      </Helmet>

      <div className="flex items-center gap-2 mb-8">
        <Link to="/shop" className="text-brand-primary hover:underline flex items-center gap-1 font-bold">
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500" fill="currentColor" size={36} />
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-2">Laptops you've saved for later.</p>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map(laptop => (
            <ProductCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-200 max-w-2xl mx-auto">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-red-200" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8">Found something you like? Click the heart icon on any product to save it here.</p>
          <Link to="/shop" className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black inline-flex items-center gap-2 hover:bg-brand-dark transition shadow-xl">
            <ShoppingBag size={20} />
            Browse Laptops
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
