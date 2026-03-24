
import React from 'react';
import { Building2, GraduationCap, PackageCheck, Send, ShieldCheck, Truck } from 'lucide-react';

const BulkOrders: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Corporate & Institutional Supply</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Equipping businesses, schools, and offices across Nigeria with premium laptops at discounted bulk rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center italic">Why Choose Yustech Logic System for Bulk Supply?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl text-brand-dark h-fit"><Building2 size={24} /></div>
              <div>
                <h3 className="font-bold text-lg">Corporate Solutions</h3>
                <p className="text-gray-500">Tailored laptop configurations for offices and remote teams.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-green-100 p-3 rounded-2xl text-green-600 h-fit"><GraduationCap size={24} /></div>
              <div>
                <h3 className="font-bold text-lg">Educational Tech</h3>
                <p className="text-gray-500">Affordable student models for secondary schools and universities.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl text-brand-primary h-fit"><PackageCheck size={24} /></div>
              <div>
                <h3 className="font-bold text-lg">Tested Inventory</h3>
                <p className="text-gray-500">Every single unit in your bulk order undergoes rigorous 10-point testing.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
          <h3 className="text-2xl font-black mb-6">Request a Bulk Quote</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Contact Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue" />
              <input type="text" placeholder="Organization Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue" />
            <input type="tel" placeholder="Phone Number" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="number" placeholder="Quantity Needed" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue" />
              <select className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue bg-white">
                <option>Preferred Category</option>
                <option>Business Laptops</option>
                <option>Student Laptops</option>
                <option>Mixed Order</option>
              </select>
            </div>
            <textarea placeholder="Tell us more about your requirements" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue h-32"></textarea>
            <button className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition">
              <Send size={20} /> Submit Quote Request
            </button>
          </form>
        </div>
      </div>

      <div className="bg-brand-dark text-white rounded-3xl p-10 md:p-20 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 italic underline decoration-brand-primary">Safely Delivered Anywhere in Nigeria</h2>
          <p className="text-emerald-50 max-w-xl mx-auto mb-10">
            We handle logistics for your bulk orders, ensuring they arrive securely packaged and ready for deployment at your location.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2"><Truck size={24} /> <span>Insured Shipping</span></div>
            <div className="flex items-center gap-2"><ShieldCheck size={24} /> <span>Bulk Warranty</span></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
          <Building2 size={300} />
        </div>
      </div>
    </div>
  );
};

export default BulkOrders;
