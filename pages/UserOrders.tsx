
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Order, OrderStatus } from '../types';
import { formatPrice } from '../constants';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    ShoppingBag,
    LogIn,
    Loader,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    [OrderStatus.ORDERS]: { icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Order Received' },
    [OrderStatus.IN_PROGRESS]: { icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'In Progress' },
    [OrderStatus.FULFILLED]: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' },
    [OrderStatus.CANCELLED]: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
};

const UserOrders: React.FC = () => {
    const { user, loading: authLoading, signInWithGoogle } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchMyOrders = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('customerEmail', user.email)
                    .order('createdAt', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
                // Fallback: try local storage
                try {
                    const saved = JSON.parse(localStorage.getItem('yustech_orders') || '[]');
                    const myOrders = saved.filter((o: Order) =>
                        o.customerEmail?.toLowerCase() === user.email?.toLowerCase()
                    );
                    setOrders(myOrders);
                } catch {
                    setOrders([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyOrders();
    }, [user]);

    // Loading state
    if (authLoading || isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader size={40} className="text-brand-primary animate-spin" />
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Loading your orders...</p>
            </div>
        );
    }

    // Not signed in
    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={40} className="text-brand-primary" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-3">Track Your Orders</h1>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        Sign in with your Google account to view your complete order history and track delivery status.
                    </p>
                    <button
                        onClick={signInWithGoogle}
                        className="w-full flex items-center justify-center gap-3 bg-brand-primary text-white font-black py-4 rounded-2xl hover:bg-brand-dark transition-all shadow-lg active:scale-95"
                    >
                        <LogIn size={20} />
                        Sign in to View Orders
                    </button>
                    <Link to="/shop" className="block mt-4 text-gray-400 text-sm font-bold hover:text-brand-primary transition">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Signed in — show orders
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-brand-primary mb-1">
                    <Package size={20} />
                    <span className="font-black uppercase tracking-widest text-xs">Order History</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
                <p className="text-gray-400 mt-1 text-sm">Showing all orders placed with <span className="font-bold text-gray-600">{user.email}</span></p>
            </div>

            {/* Empty state */}
            {orders.length === 0 ? (
                <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={40} className="text-gray-200" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">No Orders Yet</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        You haven't placed any orders yet. Browse our store and find your perfect laptop!
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-black hover:bg-brand-dark transition shadow-lg"
                    >
                        <ShoppingBag size={18} /> Shop Now
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const cfg = statusConfig[order.status] || statusConfig[OrderStatus.ORDERS];
                        const StatusIcon = cfg.icon;
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
                                {/* Order summary row */}
                                <button
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`${cfg.bg} ${cfg.color} p-3 rounded-2xl flex-shrink-0`}>
                                            <StatusIcon size={22} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm tracking-tight">{order.id}</p>
                                            <p className="text-gray-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 sm:ml-auto">
                                        <div className="text-right">
                                            <p className="text-xl font-black text-gray-900">{formatPrice(order.totalAmount)}</p>
                                            <p className="text-gray-400 text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                                            <StatusIcon size={12} />
                                            {cfg.label}
                                        </span>
                                        {isExpanded ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                                    </div>
                                </button>

                                {/* Expanded order details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 px-6 pb-6 pt-4 space-y-4">
                                        {/* Mobile status badge */}
                                        <span className={`sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                                            <StatusIcon size={12} />
                                            {cfg.label}
                                        </span>

                                        {/* Items */}
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Items Ordered</p>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <img
                                                        src={item.image || undefined}
                                                        alt={item.name}
                                                        className="w-12 h-12 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200'; }}
                                                    />
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                                                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-black text-gray-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery info */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Delivery Address</p>
                                                <p className="font-bold text-gray-700">{order.customerAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Method</p>
                                                <p className="font-bold text-gray-700">{order.paymentMethod || 'Bank Transfer'}</p>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <span className="text-gray-500 font-bold text-sm">Total Paid</span>
                                            <span className="text-xl font-black text-brand-primary">{formatPrice(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserOrders;
