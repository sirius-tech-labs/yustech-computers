
import React, { useState, useEffect, useMemo } from 'react';
import { LAPTOPS, formatPrice } from '../constants';
import { Laptop, Category, Order, OrderStatus } from '../types';
import { useCart } from '../context/CartContext';
import { supabase } from '../services/supabaseClient';
import {
  Settings,
  Plus,
  Trash2,
  RefreshCcw,
  Laptop as LaptopIcon,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  X,
  Cpu,
  Database,
  Monitor,
  HardDrive,
  Layers,
  Layout,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  User,
  MapPin,
  Phone,
  Camera
} from 'lucide-react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const {
    inventory,
    deleteInventoryItem,
    updateInventoryPrice,
    addInventoryItem,
    setIsPullToRefreshDisabled,
    isInventoryLoading
  } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'more') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadToSupabase = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop() || 'jpg';
        // Generate a random unique file name
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('laptop-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('laptop-images')
          .getPublicUrl(filePath);

        return data.publicUrl;
      };

      if (type === 'main') {
        const url = await uploadToSupabase(files[0] as File);
        setNewLaptop(prev => ({ ...prev, image: url }));
      } else {
        const currentImages = newLaptop.moreImages || [];
        const remainingSlots = 5 - currentImages.length;

        if (remainingSlots <= 0) {
          alert("Maximum number of images is 5");
          setIsUploading(false);
          return;
        }

        let selectedFiles = Array.from(files);
        if (selectedFiles.length > remainingSlots) {
          alert("Maximum number of images is 5. Only the first " + remainingSlots + " selected images will be added.");
          selectedFiles = selectedFiles.slice(0, remainingSlots);
        }

        const uploadPromises = selectedFiles.map((file) => uploadToSupabase(file as File));
        const urls = await Promise.all(uploadPromises);
        setNewLaptop(prev => ({ ...prev, moreImages: [...(prev.moreImages || []), ...urls] }));
      }
    } catch (error) {
      console.error("Error uploading image to Supabase:", error);
      alert("Failed to upload image. Please make sure you have created a public 'laptop-images' bucket in Supabase Storage.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setIsPullToRefreshDisabled(showAddForm);
    return () => setIsPullToRefreshDisabled(false);
  }, [showAddForm, setIsPullToRefreshDisabled]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Structured Specs State for the form
  const [specFields, setSpecFields] = useState({
    processor: '',
    ram: '',
    storage: '',
    graphics: 'Integrated Graphics',
    os: 'Windows 10/11 Pro',
    ports: 'USB 3.0, HDMI, VGA',
    battery: '3-4 Hours Tested'
  });

  // New Product Form State
  const [newLaptop, setNewLaptop] = useState<Partial<Laptop>>({
    brand: 'HP',
    name: '',
    specs: '', // Short summary spec
    price: 0,
    originalPrice: 0,
    category: Category.STUDENT,
    condition: 'UK-Used',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000',
    youtubeUrl: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setIsOrdersLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('createdAt', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        const saved = localStorage.getItem('yustech_orders');
        setOrders(saved ? JSON.parse(saved) : []);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('yustech_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const updatePrice = (id: string, newPrice: string) => {
    const priceNum = parseInt(newPrice.replace(/[^0-9]/g, '')) || 0;
    updateInventoryPrice(id, priceNum);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Remove this laptop from the shop?')) {
      deleteInventoryItem(id);
    }
  };

  const handleAddLaptop = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `new-${Date.now()}`;

    const detailedSpecs = [
      specFields.processor,
      specFields.ram,
      specFields.storage,
      specFields.graphics,
      specFields.os,
      specFields.ports,
      specFields.battery
    ].filter(s => s.trim() !== "");

    const autoShortSpec = `${specFields.ram} / ${specFields.storage}`;

    const laptopToAdd = {
      ...newLaptop,
      id,
      detailedSpecs,
      specs: newLaptop.specs || autoShortSpec,
      originalPrice: newLaptop.originalPrice || (newLaptop.price ? Math.round(newLaptop.price * 1.25) : 0),
      description: `Premium ${newLaptop.condition} ${newLaptop.name}. Verified and tested by Yustech Logic System Service engineers for the Nigerian market. Ready for immediate delivery.`
    } as Laptop;

    addInventoryItem(laptopToAdd);
    setShowAddForm(false);

    setSpecFields({
      processor: '',
      ram: '',
      storage: '',
      graphics: 'Integrated Graphics',
      os: 'Windows 10/11 Pro',
      ports: 'USB 3.0, HDMI, VGA',
      battery: '3-4 Hours Tested'
    });

    setNewLaptop({
      brand: 'HP',
      name: '',
      specs: '',
      price: 0,
      originalPrice: 0,
      category: Category.STUDENT,
      condition: 'UK-Used',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000',
      moreImages: [],
      youtubeUrl: ''
    });

    alert('Laptop added to your local view! Remember to "Export Site Code" to make it permanent.');
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Delete this order record?')) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (error) throw error;
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    }
  };

  const generateCode = () => {
    const code = `import { Category, Laptop } from './types';\n\nexport const LAPTOPS: Laptop[] = ${JSON.stringify(inventory, null, 2)};`;
    navigator.clipboard.writeText(code);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const groupedInventory = useMemo<Record<string, Laptop[]>>(() => {
    const groups: Record<string, Laptop[]> = {};
    inventory.forEach(laptop => {
      if (!groups[laptop.category]) {
        groups[laptop.category] = [];
      }
      groups[laptop.category].push(laptop);
    });
    return groups;
  }, [inventory]);

  const ordersByStatus = useMemo<Record<OrderStatus, Order[]>>(() => {
    return {
      [OrderStatus.ORDERS]: orders.filter(o => o.status === OrderStatus.ORDERS),
      [OrderStatus.IN_PROGRESS]: orders.filter(o => o.status === OrderStatus.IN_PROGRESS),
      [OrderStatus.FULFILLED]: orders.filter(o => o.status === OrderStatus.FULFILLED),
      [OrderStatus.CANCELLED]: orders.filter(o => o.status === OrderStatus.CANCELLED),
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-primary mb-1">
              <Settings size={20} className="animate-spin-slow" />
              <span className="font-black uppercase tracking-widest text-xs">Manager Portal</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {activeTab === 'inventory' ? 'Inventory Management' : 'Order Management'}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'inventory' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all relative ${activeTab === 'orders' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Orders
                {ordersByStatus[OrderStatus.ORDERS].length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {ordersByStatus[OrderStatus.ORDERS].length}
                  </span>
                )}
              </button>
            </div>
            {activeTab === 'inventory' && (
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={generateCode}
                  className="flex-1 md:flex-none bg-brand-primary text-white px-4 md:px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-900 transition text-xs md:text-sm"
                >
                  {isCopying ? <Check size={18} /> : <Copy size={18} />}
                  {isCopying ? 'Copied!' : 'Export Code'}
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex-1 md:flex-none bg-green-600 text-white px-4 md:px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition text-xs md:text-sm"
                >
                  <Plus size={18} /> Add Stock
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        {activeTab === 'inventory' ? (
          <>
            {/* Inventory View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="bg-blue-50 p-4 rounded-2xl text-brand-primary"><LaptopIcon size={32} /></div>
                <div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Units</p>
                  <p className="text-3xl font-black text-gray-900">{inventory.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="bg-green-50 p-4 rounded-2xl text-green-600"><TrendingUp size={32} /></div>
                <div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Store Value</p>
                  <p className="text-3xl font-black text-gray-900">{formatPrice(inventory.reduce((a, b) => a + b.price, 0))}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="bg-red-50 p-4 rounded-2xl text-red-600"><AlertCircle size={32} /></div>
                <div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Quick Status</p>
                  <p className="text-3xl font-black text-gray-900">Active</p>
                </div>
              </div>
            </div>

            {/* Grouped Inventory List */}
            <div className="space-y-12">
              {(Object.entries(groupedInventory) as [string, Laptop[]][]).map(([category, laptops]) => (
                <div key={category}>
                  <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tighter italic">
                    <div className="w-2 h-8 bg-brand-primary rounded-full"></div>
                    {category} Laptops ({laptops.length})
                  </h2>
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Live Price (₦)</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {laptops.map(laptop => (
                            <tr key={laptop.id} className="hover:bg-gray-50/50 transition">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={laptop.image || undefined}
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                    alt=""
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000";
                                    }}
                                  />
                                  <div>
                                    <p className="font-black text-gray-900 leading-none mb-1">{laptop.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{laptop.specs}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="relative max-w-[180px]">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                                  <input
                                    type="text"
                                    value={laptop.price.toLocaleString()}
                                    onChange={(e) => updatePrice(laptop.id, e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-black text-brand-primary focus:ring-2 focus:ring-brand-primary focus:bg-white outline-none"
                                  />
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => deleteItem(laptop.id)}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-red-100 transition"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Orders View */
          <div className="space-y-12">
            {/* Order Status Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { id: OrderStatus.ORDERS, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: OrderStatus.IN_PROGRESS, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { id: OrderStatus.FULFILLED, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                { id: OrderStatus.CANCELLED, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' }
              ].map(status => (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(statusFilter === status.id ? 'all' : status.id)}
                  className={`text-left bg-white p-6 rounded-3xl border transition-all hover:shadow-md active:scale-95 ${statusFilter === status.id
                    ? 'border-brand-primary ring-4 ring-brand-primary/5 shadow-lg'
                    : 'border-gray-100 shadow-sm'
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${status.bg} ${status.color} p-3 rounded-2xl`}>
                      <status.icon size={24} />
                    </div>
                    <span className="text-2xl font-black text-gray-900">{ordersByStatus[status.id].length}</span>
                  </div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{status.id}</p>
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-8">
              {statusFilter !== 'all' && (
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Showing: <span className="text-brand-primary">{statusFilter}</span>
                  </p>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    <RefreshCcw size={12} /> Show All Orders
                  </button>
                </div>
              )}
              {(Object.entries(ordersByStatus) as [OrderStatus, Order[]][])
                .filter(([status]) => statusFilter === 'all' || statusFilter === status)
                .map(([status, statusOrders]) => (
                  statusOrders.length > 0 ? (
                    <div key={status}>
                      <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tighter italic">
                        <div className={`w-2 h-8 rounded-full ${status === OrderStatus.ORDERS ? 'bg-blue-600' :
                          status === OrderStatus.IN_PROGRESS ? 'bg-emerald-600' :
                            status === OrderStatus.FULFILLED ? 'bg-green-600' : 'bg-red-600'
                          }`}></div>
                        {status} ({statusOrders.length})
                      </h2>
                      <div className="grid grid-cols-1 gap-6">
                        {statusOrders.map(order => (
                          <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden flex flex-col md:flex-row">
                            <div className="p-8 flex-grow">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <p className="text-brand-primary font-black text-lg mb-1">{order.id}</p>
                                  <p className="text-gray-400 text-xs font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-black text-gray-900">{formatPrice(order.totalAmount)}</p>
                                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{order.items.length} Items</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="flex items-start gap-3">
                                  <User size={18} className="text-gray-400 mt-1" />
                                  <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Customer</p>
                                    <p className="font-bold text-gray-900">{order.customerName}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Phone size={18} className="text-gray-400 mt-1" />
                                  <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Contact</p>
                                    <p className="font-bold text-gray-900">{order.customerPhone}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <MapPin size={18} className="text-gray-400 mt-1" />
                                  <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Address</p>
                                    <p className="font-bold text-gray-900 text-sm leading-tight">{order.customerAddress}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">{item.name} <span className="text-gray-400 font-bold">x{item.quantity}</span></span>
                                    <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-8 flex flex-col justify-center gap-3 border-l border-gray-100 md:w-64">
                              {order.status === OrderStatus.ORDERS && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, OrderStatus.IN_PROGRESS)}
                                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-orange-700 transition shadow-md"
                                >
                                  Process Order <ArrowRight size={14} />
                                </button>
                              )}
                              {order.status === OrderStatus.IN_PROGRESS && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, OrderStatus.FULFILLED)}
                                  className="w-full bg-green-600 text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-md"
                                >
                                  Mark Fulfilled <CheckCircle size={14} />
                                </button>
                              )}
                              {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.FULFILLED && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                                  className="w-full bg-white text-red-600 border border-red-100 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-red-50 transition"
                                >
                                  Cancel Order <XCircle size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="w-full text-gray-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-1"
                              >
                                <Trash2 size={12} /> Delete Record
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    statusFilter !== 'all' && (
                      <div key={status} className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <ShoppingBag size={40} className="text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4">No {status} Orders</h2>
                        <p className="text-gray-500">There are currently no orders with this status.</p>
                        <button
                          onClick={() => setStatusFilter('all')}
                          className="mt-6 text-brand-primary font-black uppercase text-xs tracking-widest hover:underline"
                        >
                          Show All Orders
                        </button>
                      </div>
                    )
                  )
                ))}
              {orders.length === 0 && (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} className="text-gray-200" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-4">No Orders Received Yet</h2>
                  <p className="text-gray-500">When customers place orders via WhatsApp or Google Form, they will appear here for your tracking.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Product Modal Overlay */}
        {showAddForm && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              <div className="bg-brand-primary p-6 text-white flex justify-between items-center shrink-0">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Plus size={20} /> Add New Laptop to Inventory
                </h2>
                <button onClick={() => setShowAddForm(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>

              {isUploading && (
                <div className="absolute inset-0 z-[110] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-brand-primary font-black uppercase tracking-widest text-xs">Processing Image...</p>
                </div>
              )}

              <form onSubmit={handleAddLaptop} className="p-8 overflow-y-auto space-y-10">
                {/* Section 1: Basic Info */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b pb-2">
                    <Layout size={20} className="text-brand-primary" /> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2 lg:col-span-2">
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Laptop Full Name</label>
                      <input required type="text" placeholder="e.g. HP EliteBook 840 G5" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" onChange={e => setNewLaptop({ ...newLaptop, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Brand</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" onChange={e => setNewLaptop({ ...newLaptop, brand: e.target.value })}>
                        <option value="HP">HP</option>
                        <option value="Dell">Dell</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Apple">Apple</option>
                        <option value="Asus">Asus</option>
                        <option value="Acer">Acer</option>
                        <option value="Microsoft">Microsoft</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Selling Price (₦)</label>
                      <input required type="number" placeholder="280000" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" onChange={e => setNewLaptop({ ...newLaptop, price: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Compare At Price (Optional)</label>
                      <input type="number" placeholder="350000" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-medium" onChange={e => setNewLaptop({ ...newLaptop, originalPrice: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Category</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" onChange={e => setNewLaptop({ ...newLaptop, category: e.target.value as Category })}>
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Main Image</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Option 1: Upload from Phone</p>
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Camera size={24} className="text-gray-400 mb-2" />
                              <p className="text-xs text-gray-500 font-bold">Tap to take photo or pick from gallery</p>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileChange(e, 'main')} />
                          </label>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Option 2: Image URL</p>
                          <input type="url" placeholder="https://..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary h-32" value={newLaptop.image} onChange={e => setNewLaptop({ ...newLaptop, image: e.target.value })} />
                        </div>
                      </div>
                      {newLaptop.image && (
                        <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <img
                            src={newLaptop.image || undefined}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000";
                            }}
                          />
                          <div>
                            <p className="text-xs font-black text-brand-primary uppercase">Image Selected</p>
                            <button type="button" onClick={() => setNewLaptop({ ...newLaptop, image: '' })} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Remove and change</button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">YouTube Embed URL (Optional)</label>
                      <input type="url" placeholder="https://www.youtube.com/embed/..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" value={newLaptop.youtubeUrl} onChange={e => setNewLaptop({ ...newLaptop, youtubeUrl: e.target.value })} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Additional Images</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Upload Multiple</p>
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col items-center justify-center">
                              <Plus size={20} className="text-gray-400 mb-1" />
                              <p className="text-[10px] text-gray-500 font-bold">Add more photos</p>
                            </div>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageFileChange(e, 'more')} />
                          </label>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Or paste URLs (Comma separated)</p>
                          <textarea
                            placeholder="Inactive: Paste image links here (e.g. https://example.com/image.jpg)"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary h-24"
                            onChange={e => {
                              const currentImages = newLaptop.moreImages || [];
                              const remainingSlots = 5 - currentImages.length;

                              let urls = e.target.value.split(',').map(u => u.trim()).filter(u => u !== "");

                              if (urls.length > remainingSlots) {
                                alert("Maximum number of images is 5");
                                urls = urls.slice(0, remainingSlots);
                              }

                              setNewLaptop({ ...newLaptop, moreImages: [...currentImages, ...urls] });
                            }} />
                        </div>
                      </div>
                      {newLaptop.moreImages && newLaptop.moreImages.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {newLaptop.moreImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img || undefined}
                                alt={`Preview ${idx}`}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setNewLaptop({ ...newLaptop, moreImages: newLaptop.moreImages?.filter((_, i) => i !== idx) })}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Detailed Technical Specs */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b pb-2">
                    <Cpu size={20} className="text-brand-primary" /> Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 mb-2"><Cpu size={14} /> Processor</label>
                      <input required type="text" placeholder="Intel Core i5-8250U 8th Gen" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" value={specFields.processor} onChange={e => setSpecFields({ ...specFields, processor: e.target.value })} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 mb-2"><Layers size={14} /> RAM</label>
                      <input required type="text" placeholder="8GB DDR4 RAM (Upgradable)" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" value={specFields.ram} onChange={e => setSpecFields({ ...specFields, ram: e.target.value })} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 mb-2"><Database size={14} /> Storage</label>
                      <input required type="text" placeholder="256GB NVMe SSD" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" value={specFields.storage} onChange={e => setSpecFields({ ...specFields, storage: e.target.value })} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 mb-2"><Monitor size={14} /> Graphics</label>
                      <input required type="text" placeholder="Intel UHD Graphics 620" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" value={specFields.graphics} onChange={e => setSpecFields({ ...specFields, graphics: e.target.value })} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 mb-2"><Layout size={14} /> OS</label>
                      <input required type="text" placeholder="Windows 11 Pro" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" value={specFields.os} onChange={e => setSpecFields({ ...specFields, os: e.target.value })} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 mb-2"><HardDrive size={14} /> Ports & Connectivity</label>
                      <input required type="text" placeholder="USB-C, HDMI, SD Card Reader" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" value={specFields.ports} onChange={e => setSpecFields({ ...specFields, ports: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full bg-brand-primary text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-900 transition shadow-xl flex items-center justify-center gap-3">
                    <Plus size={24} /> Add Product to Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Growth Tip & Database Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
          <div className="bg-brand-primary rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h4 className="text-2xl font-black mb-4 flex items-center gap-2">
                <TrendingUp size={28} className="text-blue-300" /> Owner's Growth Tip
              </h4>
              <p className="text-blue-100 leading-relaxed mb-6 font-medium">
                "Nigeria's tech market moves fast. Use this dashboard every morning to adjust prices based on the current FX rate. When prices are low, tag your items as 'Best for School' to capture the massive student audience in Ikeja and beyond."
              </p>
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-blue-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Check size={16} /> Update Daily • <Check size={16} /> Export Weekly
              </div>
            </div>
            <Settings size={180} className="absolute -right-10 -bottom-10 text-white/5 animate-spin-slow" />
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl flex flex-col justify-center">
            <h4 className="text-2xl font-black mb-4 text-gray-900 flex items-center gap-2 uppercase tracking-tighter italic">
              <RefreshCcw size={28} className="text-green-600" /> Need Real-Time Sync?
            </h4>
            <p className="text-gray-500 leading-relaxed mb-8">
              Currently, your changes are saved in your browser. To make your site update <strong>instantly for everyone</strong> without pasting code, we can connect this dashboard to a <strong>Supabase Database</strong>.
            </p>
            <button className="w-full py-4 border-2 border-brand-primary text-brand-primary rounded-2xl font-black hover:bg-brand-primary hover:text-white transition uppercase tracking-widest text-xs">
              Request Database Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
