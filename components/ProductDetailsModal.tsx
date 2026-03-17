
import React, { useState } from 'react';
import { Laptop } from '../types';
import { formatPrice } from '../constants';
import { X, CheckCircle, ShieldCheck, Truck, ShoppingCart, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailsModalProps {
  laptop: Laptop;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ laptop, onClose }) => {
  const [activeImg, setActiveImg] = useState(laptop.image);
  const { addToCart } = useCart();
  const allImages = [laptop.image, ...(laptop.moreImages || [])];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition"
        >
          <X size={20} />
        </button>

        {/* Gallery Panel */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col items-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-inner">
            <img
              src={activeImg || undefined}
              alt={laptop.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000";
              }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full pb-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(img)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${activeImg === img ? 'border-tech-blue' : 'border-transparent'}`}
              >
                <img src={img || undefined} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="mb-6">
            <div className="flex gap-2 mb-2">
              <span className="bg-emerald-100 text-brand-primary text-[10px] uppercase font-bold px-2 py-1 rounded">
                {laptop.condition}
              </span>
              <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1">
                <ShieldCheck size={10} /> In Stock (Ikeja)
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">{laptop.name}</h2>
            <p className="text-gray-500 font-medium">{laptop.brand} Professional Grade</p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-black text-tech-blue">{formatPrice(laptop.price)}</span>
            <span className="text-lg text-gray-400 line-through font-bold">{formatPrice(laptop.originalPrice)}</span>
            <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 rounded">
              - {Math.round((1 - laptop.price / laptop.originalPrice) * 100)}% OFF
            </span>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info size={16} className="text-tech-blue" /> Full Technical Specs
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {laptop.detailedSpecs?.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <Truck size={16} className="text-tech-blue" /> Secure Nationwide Delivery
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <ShieldCheck size={16} className="text-green-500" /> Professional 10-Point Tested
              </div>
            </div>
          </div>

          <button
            onClick={() => { addToCart(laptop); onClose(); }}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-brand-dark transition active:scale-[0.98]"
          >
            <ShoppingCart size={24} />
            Add to My Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
