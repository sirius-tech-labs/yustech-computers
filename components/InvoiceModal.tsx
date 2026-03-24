
import React, { useRef, useState } from 'react';
import { X, CheckCircle, MessageCircle, Download, Loader2 } from 'lucide-react';
import { formatPrice, WHATSAPP_NUMBER } from '../constants';
import { CartItem } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface InvoiceModalProps {
  order: {
    id: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
  };
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const openWhatsApp = () => {
    let message = `*NEW ORDER FROM YUSTECH LOGIC SYSTEM*%0A%0A`;
    message += `*Order ID:* ${order.id}%0A`;
    message += `*Name:* ${order.customerName}%0A`;
    message += `*Total:* ${formatPrice(order.totalAmount)}%0A%0A`;
    message += `I just placed an order. Please confirm availability.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const downloadImage = async () => {
    if (!invoiceRef.current) return;

    try {
      setIsDownloading(true);

      // Delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });

      // Convert to JPG and download
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Yustech_Invoice_${order.id.slice(-8)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating Image:', error);
      alert('Failed to save invoice. Please take a screenshot instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-xl transition-all">
      <div className="bg-white w-full max-w-5xl rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 flex flex-col max-h-[98vh] border border-white/20">
        {/* Compact Success Header */}
        <div className="bg-green-600 px-6 py-4 md:py-6 text-white text-center relative flex items-center justify-center gap-4">
          <div className="bg-white/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle size={24} className="md:w-8 md:h-8" />
          </div>
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">Order Successful!</h2>
            <p className="text-green-100 text-xs font-bold mt-1 opacity-90">Recorded in our system.</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-1/2 -translate-y-1/2 right-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Improved Actions Layout */}
        <div className="p-4 md:p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row gap-3 md:gap-4 items-center">
          <button
            onClick={openWhatsApp}
            className="w-full sm:flex-1 bg-green-600 text-white py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-green-700 transition active:scale-95 text-lg"
          >
            <MessageCircle size={22} /> WhatsApp Business
          </button>

          <button
            onClick={downloadImage}
            disabled={isDownloading}
            className={`w-full sm:flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black transition active:scale-95 text-lg shadow-lg ${isDownloading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-brand-primary text-white hover:bg-brand-dark shadow-brand-primary/20'
              }`}
          >
            {isDownloading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download size={22} />
                <span>Download Invoice (PDF)</span>
              </>
            )}
          </button>
        </div>

        {/* Blatant Invoice Preview Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-12 bg-gray-200/50 flex flex-col items-center gap-8">
          <div className="w-full max-w-[210mm] text-center">
            <span className="inline-block px-4 py-1 bg-gray-300/50 rounded-full text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Official Document Preview</span>
          </div>

          <div
            ref={invoiceRef}
            className="bg-white p-6 md:p-16 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] mx-auto w-full max-w-[210mm] text-gray-800 font-sans border border-gray-100 flex flex-col"
            style={{ minHeight: '297mm' }}
          >
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b-8 border-brand-primary pb-10 mb-12 gap-6">
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex flex-col -space-y-1 items-start">
                    <span className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Yustech Logic</span>
                    <span className="text-sm font-black text-brand-primary tracking-widest uppercase leading-none mt-1">System Services</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Solutions Provider</p>
                  <p className="text-sm font-bold text-gray-600">Computer Village, Lagos, Nigeria</p>
                  <p className="text-sm font-black text-brand-primary underline underline-offset-4">yustech4luv@gmail.com</p>
                </div>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                <h1 className="text-5xl md:text-7xl font-black text-gray-200 uppercase tracking-tighter -mt-2 mb-4 leading-none select-none">INVOICE</h1>
                <div className="space-y-1">
                  <p className="text-sm font-black text-gray-400 uppercase">Document Number</p>
                  <p className="text-xl font-black text-gray-900">#INV-{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm font-bold text-gray-500 mt-2">Issued: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Customer & Traceability Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 px-4 py-8 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div>
                <h3 className="text-[10px] font-black text-tech-blue uppercase tracking-[0.3em] mb-4">Customer Details</h3>
                <p className="font-black text-2xl text-gray-900 mb-2">{order.customerName}</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 font-bold leading-relaxed">{order.customerAddress}</p>
                  <p className="text-lg font-black text-gray-900 mt-4 tabular-nums">{order.customerPhone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-tech-blue uppercase tracking-[0.3em] mb-4">Transaction Meta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment</span>
                    <span className="text-xs font-black text-gray-900 uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest italic">Awaiting Verification</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Table Design */}
            <div className="mb-16">
              <div className="grid grid-cols-12 bg-gray-900 text-white rounded-t-2xl px-6 py-4">
                <div className="col-span-6 text-[10px] font-black uppercase tracking-widest">Specifications & Item</div>
                <div className="col-span-2 text-center text-[10px] font-black uppercase tracking-widest">Qty</div>
                <div className="col-span-2 text-right text-[10px] font-black uppercase tracking-widest">Unit Price</div>
                <div className="col-span-2 text-right text-[10px] font-black uppercase tracking-widest text-blue-400">Total</div>
              </div>
              <div className="border-x border-b border-gray-100 rounded-b-2xl overflow-hidden divide-y divide-gray-50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 px-6 py-8 items-center hover:bg-gray-50/50 transition-colors">
                    <div className="col-span-6 pr-4">
                      <p className="font-black text-gray-900 text-lg leading-tight mb-2 uppercase">{item.name}</p>
                      <p className="text-[11px] text-gray-400 font-bold leading-relaxed max-w-xs">{item.specs}</p>
                    </div>
                    <div className="col-span-2 text-center font-black text-gray-900 tabular-nums">×{item.quantity}</div>
                    <div className="col-span-2 text-right font-bold text-gray-500 tabular-nums">{formatPrice(item.price)}</div>
                    <div className="col-span-2 text-right font-black text-brand-primary text-lg tabular-nums">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals & Security Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-auto">
              <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50 self-start">
                <h4 className="text-[10px] font-black text-tech-blue uppercase tracking-widest mb-4">Official Guarantee</h4>
                <p className="text-xs text-blue-900/60 font-bold italic leading-relaxed">
                  "We certify that this invoice represents genuine premium stock. Quality is our contract with you. Welcome to the Yustech community."
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm px-4">
                  <span className="text-gray-400 font-black uppercase tracking-widest">Net Subtotal</span>
                  <span className="font-black text-gray-900 tabular-nums">{formatPrice(order.totalAmount - (order.totalAmount > 10000 ? 5000 : 0))}</span>
                </div>
                <div className="flex justify-between items-center text-sm px-4">
                  <span className="text-gray-400 font-black uppercase tracking-widest">Shipping & Handling</span>
                  <span className="font-bold text-gray-900 tabular-nums">+{formatPrice(order.totalAmount > 10000 ? 5000 : 0)}</span>
                </div>
                <div className="bg-brand-dark p-6 rounded-[2rem] flex justify-between items-center shadow-xl shadow-brand-dark/20">
                  <span className="text-white font-black uppercase tracking-tighter text-sm">Amount Due</span>
                  <span className="text-white font-black text-3xl tabular-nums tracking-tighter">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Signature & System Footer */}
            <div className="mt-20 pt-10 border-t-2 border-dashed border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="text-left">
                  <div className="w-40 h-10 border-b-2 border-gray-900 mb-2 relative">
                    <span className="absolute -top-4 left-2 font-dancing text-gray-300 transform -rotate-6 select-none opacity-50">Authorized Official</span>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Validation Signature</p>
                </div>
                <div className="text-right flex-grow">
                  <p className="text-sm font-black text-gray-900 mb-2 italic">Building Trust, For Over a Decade.</p>
                  <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-sm ml-auto">
                    Yustech Logic System. Computer Village, Lagos. <br />
                    Orders are processed within 24-48 hours. WhatsApp Support: +234 802 651 2829.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white max-w-md w-full text-center">
            <p className="text-xs text-gray-500 font-bold mb-4 italic">Please verify the details above before downloading or proceeding to WhatsApp.</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-brand-primary font-black uppercase text-[10px] tracking-[0.3em] transition underline underline-offset-8 decoration-gray-200 hover:decoration-brand-primary"
            >
              Return to Shop and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
