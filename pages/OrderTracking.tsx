
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Package, Truck, CheckCircle, Clock, Search, ArrowLeft, Phone, XCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../constants';
import { supabase } from '../services/supabaseClient';

interface OrderData {
    id: string;
    customerName: string;
    status: string;
    items: any[];
    totalAmount: number;
    createdAt: string;
    customerAddress?: string;
}

const STATUS_STEPS = [
    { key: 'ORDERS', label: 'Order Placed', icon: Package, color: 'blue' },
    { key: 'IN PROGRESS', label: 'Processing', icon: Clock, color: 'yellow' },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'purple' },
    { key: 'FULFILLED', label: 'Delivered', icon: CheckCircle, color: 'green' },
];

const OrderTracking: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [foundOrder, setFoundOrder] = useState<OrderData | null>(null);
    const [searched, setSearched] = useState(false);
    const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Load recent orders from localStorage on mount
    useEffect(() => {
        try {
            const orders: OrderData[] = JSON.parse(localStorage.getItem('wonderful_orders') || '[]');
            setRecentOrders(orders.slice(0, 5)); // Show last 5 orders
        } catch {
            setRecentOrders([]);
        }
    }, []);

    const handleSearch = async (searchId?: string) => {
        const idToSearch = (searchId || orderId).trim();
        if (!idToSearch) return;

        setIsSearching(true);
        setOrderId(idToSearch);

        // 1. Try Supabase first (has the latest status from admin)
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', idToSearch)
                .single();

            if (!error && data) {
                setFoundOrder(data);
                setSearched(true);
                setIsSearching(false);
                return;
            }
        } catch {
            // Supabase failed, fall through to localStorage
        }

        // 2. Fallback to localStorage
        try {
            const orders: OrderData[] = JSON.parse(localStorage.getItem('wonderful_orders') || '[]');
            const found = orders.find(o => o.id.toLowerCase() === idToSearch.toLowerCase());
            setFoundOrder(found || null);
        } catch {
            setFoundOrder(null);
        }
        setSearched(true);
        setIsSearching(false);
    };

    const currentStepIndex = useMemo(() => {
        if (!foundOrder) return -1;
        if (foundOrder.status === 'CANCELLED') return -1;
        const idx = STATUS_STEPS.findIndex(s => s.key === foundOrder.status);
        return idx >= 0 ? idx : 0;
    }, [foundOrder]);

    const getStatusBadge = (status: string) => {
        const map: Record<string, { bg: string; text: string; label: string }> = {
            'ORDERS': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Placed' },
            'IN PROGRESS': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Processing' },
            'SHIPPED': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' },
            'FULFILLED': { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
            'CANCELLED': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
        };
        const s = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        return (
            <span className={`${s.bg} ${s.text} px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}>
                {s.label}
            </span>
        );
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 min-h-[70vh]">
            <Helmet>
                <title>Track Your Order | Yustech Logic System</title>
                <meta name="description" content="Track your laptop order status in real-time at Yustech. See if your order has been placed, is being processed, shipped, or delivered." />
            </Helmet>

            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-bold transition group mb-8">
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition">
                    <ArrowLeft size={20} />
                </div>
                Back to Home
            </Link>

            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                    <Package size={16} />
                    Order Tracking
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Track Your Order</h1>
                <p className="text-gray-500 font-medium">Enter your Order ID or select a recent order below.</p>
            </div>

            {/* Search Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-3 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Enter Order ID (e.g., ORD-1710612345678)"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none text-sm font-bold text-gray-900 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-900 transition active:scale-95 shadow-lg disabled:opacity-50"
                >
                    {isSearching ? '...' : 'Track'}
                </button>
            </form>

            {/* Recent Orders List */}
            {!foundOrder && recentOrders.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock size={14} />
                        Your Recent Orders
                    </h3>
                    <div className="space-y-3">
                        {recentOrders.map(order => (
                            <button
                                key={order.id}
                                onClick={() => handleSearch(order.id)}
                                className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:border-brand-primary hover:shadow-md transition-all text-left group"
                            >
                                <div className="bg-blue-50 p-3 rounded-xl text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                    <Package size={20} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-black text-sm text-gray-900">{order.id}</p>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {order.customerName} • {order.items?.length || 0} item(s) • {new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-brand-primary font-black text-sm hidden sm:block">{formatPrice(order.totalAmount)}</span>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* No Recent Orders */}
            {!foundOrder && !searched && recentOrders.length === 0 && (
                <div className="bg-gray-50 p-8 rounded-2xl text-center mb-8">
                    <p className="text-gray-400 text-sm font-bold">No recent orders found on this device.</p>
                    <p className="text-gray-400 text-xs mt-1">Place an order or enter your Order ID above to track it.</p>
                </div>
            )}

            {/* Not Found */}
            {searched && !foundOrder && (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-red-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Order Not Found</h3>
                    <p className="text-gray-500 text-sm">Please double-check your Order ID. It's usually in the format <span className="font-bold">ORD-XXXXXXXXXXXXX</span>.</p>
                    <p className="text-gray-400 text-xs mt-4">If you need help, contact us on WhatsApp: <a href="https://wa.me/2347064757296" className="text-brand-primary font-bold">+234 706 475 7296</a></p>
                    <button
                        onClick={() => { setSearched(false); setFoundOrder(null); setOrderId(''); }}
                        className="mt-6 text-brand-primary font-bold text-sm underline"
                    >
                        ← Back to recent orders
                    </button>
                </div>
            )}

            {/* Order Found - Status Tracker */}
            {foundOrder && (
                <div className="space-y-8">
                    {/* Back button */}
                    <button
                        onClick={() => { setFoundOrder(null); setSearched(false); setOrderId(''); }}
                        className="text-brand-primary font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                        <ArrowLeft size={14} /> Back to recent orders
                    </button>

                    {/* Cancelled Notice */}
                    {foundOrder.status === 'CANCELLED' && (
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
                            <div className="bg-red-500 p-3 rounded-xl text-white flex-shrink-0">
                                <XCircle size={20} />
                            </div>
                            <div>
                                <p className="font-black text-sm text-red-700">This order has been cancelled.</p>
                                <p className="text-xs text-red-600">If you believe this is an error, please contact us on WhatsApp.</p>
                            </div>
                        </div>
                    )}

                    {/* Status Stepper */}
                    {foundOrder.status !== 'CANCELLED' && (
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-8">Order Status</h3>
                            <div className="flex items-center justify-between relative">
                                {/* Progress Line */}
                                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 rounded-full">
                                    <div
                                        className="h-full bg-brand-primary rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                                    />
                                </div>
                                {STATUS_STEPS.map((step, i) => {
                                    const isActive = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.key} className="relative flex flex-col items-center z-10">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive
                                                ? 'bg-brand-primary text-white shadow-lg shadow-blue-200'
                                                : 'bg-gray-100 text-gray-400'
                                                } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}>
                                                <Icon size={18} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest mt-3 ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900">Order Details</h3>
                            <span className="bg-blue-50 text-brand-primary px-3 py-1 rounded-full text-xs font-black">{foundOrder.id}</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Customer</span>
                                <span className="font-bold text-gray-900">{foundOrder.customerName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Date</span>
                                <span className="font-bold text-gray-900">{new Date(foundOrder.createdAt).toLocaleDateString('en-NG', { dateStyle: 'long' })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Items</span>
                                <span className="font-bold text-gray-900">{foundOrder.items?.length || 0} item(s)</span>
                            </div>
                            {foundOrder.items && foundOrder.items.length > 0 && (
                                <div className="pt-2 space-y-2">
                                    {foundOrder.items.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                            {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                                            <div className="flex-grow min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                                <p className="text-[10px] text-gray-500">Qty: {item.quantity || 1}</p>
                                            </div>
                                            <span className="text-xs font-black text-brand-primary">{formatPrice(item.price * (item.quantity || 1))}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-between text-sm border-t border-gray-100 pt-4">
                                <span className="text-gray-500 font-bold">Total</span>
                                <span className="font-black text-brand-primary text-lg">{formatPrice(foundOrder.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
                        <div className="bg-brand-primary p-3 rounded-xl text-white flex-shrink-0">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-900">Need help with this order?</p>
                            <p className="text-xs text-gray-600">Contact us on WhatsApp with your Order ID for instant support.</p>
                        </div>
                        <a href="https://wa.me/2347064757296" target="_blank" rel="noopener noreferrer" className="ml-auto bg-brand-primary text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-900 transition whitespace-nowrap">
                            Chat Now
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
