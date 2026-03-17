
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, WHATSAPP_NUMBER } from '../constants';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, CreditCard, Banknote, Camera, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import InvoiceModal from '../components/InvoiceModal';
import { supabase } from '../services/supabaseClient';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Comprehensive form state
  const [formData, setFormData] = useState({
    name: '',
    fullAddress: '',
    country: 'Nigeria',
    state: '',
    phoneNumber: '',
    whatsappNumber: '',
    paymentMethod: 'Bank Transfer',
    idImage: ''
  });

  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = useMemo(() => {
    const state = formData.state.toLowerCase().trim();
    if (!state) return 0;
    if (state === 'lagos') return 2500;
    if (['ogun', 'oyo', 'osun', 'ekiti', 'ondo'].includes(state)) return 5000;
    return 7500; // Rest of Nigeria
  }, [formData.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppMessage = () => {
    let message = `*NEW ORDER FROM YUSTECH LOGIC SYSTEM SERVICE*%0A%0A`;
    message += `*--- CUSTOMER INFO ---*%0A`;
    message += `*Name:* ${formData.name}%0A`;
    message += `*Address:* ${formData.fullAddress}%0A`;
    message += `*Country:* ${formData.country}%0A`;
    message += `*State:* ${formData.state}%0A`;
    message += `*Phone:* ${formData.phoneNumber}%0A`;
    message += `*WhatsApp:* ${formData.whatsappNumber}%0A`;
    message += `*Payment:* ${formData.paymentMethod}%0A`;
    if (formData.paymentMethod === 'Bank Transfer' && formData.idImage) {
      message += `*ID Provided:* Yes (Attached in order)%0A`;
    }
    message += `%0A*--- ORDER ITEMS ---*%0A`;
    cart.forEach(item => {
      message += `- ${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}%0A`;
    });

    message += `%0A*Subtotal:* ${formatPrice(cartTotal)}%0A`;
    message += `*Shipping:* ${formatPrice(shippingCost)}%0A`;
    message += `*TOTAL AMOUNT:* ${formatPrice(cartTotal + shippingCost)}%0A%0A`;
    message += `Please confirm availability and delivery timeframe.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Save order to local storage and Supabase
    const newOrder = {
      id: `ORD-${Date.now()}`,
      customerName: formData.name,
      customerEmail: user?.email || '',
      customerPhone: formData.phoneNumber,
      customerAddress: `${formData.fullAddress}, ${formData.state}, ${formData.country}`,
      items: [...cart],
      totalAmount: cartTotal + shippingCost,
      paymentMethod: formData.paymentMethod,
      idImage: formData.idImage,
      status: 'ORDERS',
      createdAt: new Date().toISOString()
    };

    // 1. Save to local storage immediately
    try {
      const existingOrders = JSON.parse(localStorage.getItem('yustech_orders') || '[]');
      localStorage.setItem('yustech_orders', JSON.stringify([newOrder, ...existingOrders]));
    } catch (err) {
      console.error('Local storage save failed:', err);
    }

    // 2. Show the invoice modal immediately so the user sees progress
    setPlacedOrder(newOrder);
    setShowInvoice(true);
    setIsSubmitting(false);

    // 3. Attempt to save to Supabase in the background (don't block the redirect)
    (async () => {
      try {
        const { error } = await supabase.from('orders').insert([{
          id: newOrder.id,
          customerName: newOrder.customerName,
          customerEmail: newOrder.customerEmail,
          customerPhone: newOrder.customerPhone,
          customerAddress: newOrder.customerAddress,
          items: newOrder.items,
          totalAmount: newOrder.totalAmount,
          paymentMethod: newOrder.paymentMethod,
          idImage: newOrder.idImage,
          status: newOrder.status,
          createdAt: newOrder.createdAt
        }]);
        if (error) console.error('Supabase background save failed:', error);
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    })();

    // 4. Redirect to WhatsApp
    const whatsappUrl = generateWhatsAppMessage();

    // Use a small delay to allow the UI to update (show modal) before redirecting or opening new tab
    setTimeout(() => {
      // Try opening in new tab first
      const newWindow = window.open(whatsappUrl, '_blank');

      // If popup is blocked, use location.assign as a fallback
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.assign(whatsappUrl);
      }
    }, 500);
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    clearCart();
    navigate('/shop');
  };

  if (cartCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md mx-auto">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looking for a deal? Our store is packed with high-quality laptops ready for nationwide delivery.</p>
          <Link to="/shop" className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold inline-block hover:bg-blue-900 transition">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/shop" className="text-brand-primary hover:underline flex items-center gap-1 font-bold">
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Order Items <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{cartCount}</span>
          </h2>
          {cart.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image || undefined} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded border border-gray-100"><Minus size={12} /></button>
                    <span className="text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded border border-gray-100"><Plus size={12} /></button>
                  </div>
                  <p className="text-sm font-black text-brand-primary">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Shipping (Est.)</span>
              <span className="font-bold text-green-600">{formData.state ? formatPrice(shippingCost) : 'Select State'}</span>
            </div>
            <div className="flex justify-between items-center text-brand-primary font-black text-2xl pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>{formatPrice(cartTotal + shippingCost)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleCheckout} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
            <div>
              <h3 className="text-2xl font-black mb-6">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full legal name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Delivery Address <span className="text-red-500">*</span></label>
                  <textarea
                    name="fullAddress"
                    required
                    rows={3}
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    placeholder="House Number, Street Name, Area/District"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
                  <input
                    name="country"
                    required
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g. Nigeria"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                  <input
                    name="state"
                    required
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Lagos"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    name="phoneNumber"
                    required
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Active calling number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number <span className="text-red-500">*</span></label>
                  <input
                    name="whatsappNumber"
                    required
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="WhatsApp enabled number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <CreditCard className="text-brand-primary" size={24} /> Payment Method <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'Bank Transfer' ? 'border-brand-primary bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={formData.paymentMethod === 'Bank Transfer'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-brand-primary"
                  />
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-brand-primary shadow-sm"><Banknote size={20} /></div>
                    <div>
                      <p className="font-bold text-sm">Bank Transfer</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Fastest processing</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'Payment on Delivery' ? 'border-brand-primary bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Payment on Delivery"
                    checked={formData.paymentMethod === 'Payment on Delivery'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-brand-primary"
                  />
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-green-600 shadow-sm"><Truck size={20} /></div>
                    <div>
                      <p className="font-bold text-sm">Payment on Delivery</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Lagos & Major Cities Only</p>
                    </div>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'Bank Transfer' && (
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-brand-primary text-white p-2 rounded-lg"><ShieldCheck size={20} /></div>
                    <h4 className="font-bold text-gray-900">Means of Identification</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    For bank transfers, we require a valid ID (National ID, Driver's License, or Voter's Card) to verify the transaction.
                  </p>
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-primary/30 rounded-2xl cursor-pointer hover:bg-white transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera size={24} className="text-brand-primary mb-2" />
                        <p className="text-xs text-brand-primary font-bold">
                          {formData.idImage ? 'ID Uploaded Successfully' : 'Tap to upload or take photo of your ID'}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, idImage: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        required={formData.paymentMethod === 'Bank Transfer'}
                      />
                    </label>
                    {formData.idImage && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                        <img src={formData.idImage} alt="ID Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, idImage: '' }))}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 bg-brand-primary hover:bg-blue-900 text-white py-5 rounded-2xl font-black text-xl transition shadow-xl active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <ShoppingBag size={24} />
                {isSubmitting ? 'Processing Order...' : 'Order'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 text-gray-400">
              <div className="flex items-center gap-2 text-xs font-bold uppercase">
                <Truck size={16} className="text-brand-primary" />
                <span>Secure Nationwide Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase">
                <ShieldCheck size={16} className="text-green-500" />
                <span>Tested & Reliable Quality</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showInvoice && placedOrder && (
        <InvoiceModal
          order={placedOrder}
          onClose={handleCloseInvoice}
        />
      )}
    </div>
  );
};

export default Cart;
