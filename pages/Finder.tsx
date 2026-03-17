
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ShoppingBag, ExternalLink, ShoppingCart, Zap } from 'lucide-react';
import { getLaptopRecommendation, BotReply } from '../services/geminiService';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Laptop } from '../types';
import { formatPrice } from '../constants';

interface Message {
  role: 'user' | 'bot';
  text: string;
  products?: Laptop[];
}

const QUICK_PROMPTS = [
  'Student laptop under ₦200k',
  'Best laptop for programming',
  'Gaming laptop with 16GB RAM',
  'Business laptop under ₦350k',
  'Lightest laptop for travel',
];

const ProductCard: React.FC<{ laptop: Laptop }> = ({ laptop }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(laptop);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = laptop.originalPrice > laptop.price
    ? Math.round(((laptop.originalPrice - laptop.price) / laptop.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col">
      {/* Image */}
      <div className="relative h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={laptop.image || undefined}
          alt={laptop.name}
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400'; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            -{discount}% OFF
          </span>
        )}
        <span className="absolute top-2 left-2 bg-brand-primary/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
          {laptop.condition}
        </span>
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col flex-grow">
        <p className="font-black text-gray-900 text-sm leading-tight mb-0.5 line-clamp-2">{laptop.name}</p>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2 line-clamp-1">{laptop.specs}</p>
        <div className="mt-auto">
          <p className="text-brand-primary font-black text-base">{formatPrice(laptop.price)}</p>
          {discount > 0 && (
            <p className="text-gray-400 text-xs line-through">{formatPrice(laptop.originalPrice)}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 ${added
            ? 'bg-green-500 text-white'
            : 'bg-brand-primary text-white hover:bg-blue-900'
            }`}
        >
          <ShoppingCart size={13} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
        <button
          onClick={() => navigate(`/product/${laptop.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-black text-xs border-2 border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95"
        >
          <ExternalLink size={13} />
          View
        </button>
      </div>
    </div>
  );
};

const Finder: React.FC = () => {
  const { setIsPullToRefreshDisabled, inventory, isInventoryLoading } = useCart();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Hello! 👋 I\'m your Yustech Smart Assistant. I can help you find the perfect laptop based on your budget and needs — with nationwide delivery across Nigeria! What can I find for you today?',
    }
  ]);

  useEffect(() => {
    setIsPullToRefreshDisabled(true);
    return () => setIsPullToRefreshDisabled(false);
  }, [setIsPullToRefreshDisabled]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsLoading(true);

    const reply: BotReply = await getLaptopRecommendation(text, inventory);
    setMessages(prev => [...prev, {
      role: 'bot',
      text: reply.message,
      products: reply.products,
    }]);
    setIsLoading(false);
  };

  const handleSend = () => sendMessage(input.trim());

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col" style={{ height: 'calc(100vh - 160px)', minHeight: '560px' }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-emerald-700 p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Bot size={26} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Smart Laptop Finder</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-gray-300 font-bold">Yustech Logic System Service | Lagos, Nigeria</p>
              </div>
            </div>
          </div>
          <Link to="/shop" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors">
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Browse Catalog</span>
          </Link>
        </div>

        {/* Quick Prompts */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="flex-shrink-0 text-[11px] font-bold bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-brand-primary hover:text-brand-primary transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto bg-gray-50 p-4 space-y-4"
        >
          {isInventoryLoading && inventory.length <= 13 && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 flex items-center gap-2.5">
                <Loader2 size={16} className="animate-spin text-brand-primary flex-shrink-0" />
                <span className="text-sm text-gray-500 italic">Connecting to inventory store...</span>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                {/* Message bubble */}
                <div className={`rounded-2xl p-4 shadow-sm flex gap-2.5 ${m.role === 'user'
                  ? 'bg-brand-primary text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                  {m.role === 'bot' && <Bot size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  {m.role === 'user' && <User size={16} className="mt-0.5 flex-shrink-0 opacity-80" />}
                </div>

                {/* Product cards */}
                {m.role === 'bot' && m.products && m.products.length > 0 && (
                  <div className={`grid gap-3 w-full ${m.products.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-2'}`}>
                    {m.products.map(laptop => (
                      <ProductCard key={laptop.id} laptop={laptop} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 flex items-center gap-2.5">
                <Loader2 size={16} className="animate-spin text-brand-primary flex-shrink-0" />
                <span className="text-sm text-gray-500 italic">Searching our inventory for the best deals...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="e.g. I need a fast laptop for coding under ₦300k"
              className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all text-sm text-gray-900"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 bg-brand-primary text-white p-3 rounded-xl hover:bg-blue-900 transition-colors disabled:opacity-40 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-bold flex items-center justify-center gap-1">
            <Zap size={10} className="text-brand-primary" /> Smart Matching · Forever Free
          </p>
        </div>
      </div>
    </div>
  );
};

export default Finder;
