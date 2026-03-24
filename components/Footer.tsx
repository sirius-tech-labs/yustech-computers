
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Truck, Settings } from 'lucide-react';

import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div>
          <Logo variant="white" className="mb-6" />
          <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
            Premium Nigerian retailer specializing in high-quality tech solutions, laptop repairs, and digital services. We prioritize reliability, trust, and exceptional nationwide delivery.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"><Facebook size={18} /></a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"><Twitter size={18} /></a>
            <a href="https://www.instagram.com/info_fix_laptops_gadgets/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium">
            <li><Link to="/shop" className="hover:text-emerald-400 transition">Shop Catalog</Link></li>
            <li><Link to="/student-deals" className="hover:text-emerald-400 transition">Student Specials</Link></li>
            <li><Link to="/bulk-orders" className="hover:text-emerald-400 transition">Corporate Orders</Link></li>
            <li><Link to="/finder" className="hover:text-emerald-400 transition">Smart Finder</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contact Us</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium">
            <li>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white mb-1">Store Address</p>
                  <p className="text-xs leading-relaxed">1, adepele street, off medical road, beside UBA bank, computer village, Lagos</p>
                </div>
              </div>
            </li>
            <li className="flex items-center gap-3 mt-6"><Phone size={18} className="text-emerald-500" /> <span className="hover:text-white transition">+234 706 535 4260</span></li>
            <li className="flex items-center gap-3"><Mail size={18} className="text-emerald-500" /> <span className="hover:text-white transition">yustech4luv@gmail.com</span></li>
          </ul>
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            <h4 className="font-black text-emerald-500 text-xs uppercase tracking-[0.2em] mb-4">Words of Wisdom</h4>
            <p className="text-lg font-bold italic leading-relaxed text-white mb-6 relative z-10">
              "There is plenty of room at the top because very few people care to travel beyond the average route."
            </p>
            <div className="flex items-center gap-3 border-t border-white/10 pt-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400">NA</div>
              <div>
                <p className="font-black text-xs text-white">Nnamdi Azikiwe</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">First President of Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-medium">
        <p>&copy; {new Date().getFullYear()} Yustech Logic System. Trusted Retailer. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
