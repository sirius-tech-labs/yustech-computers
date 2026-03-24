
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, X, Scale, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../constants';
import { Laptop } from '../types';

const Compare: React.FC = () => {
    const { inventory, addToCart } = useCart();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showPicker, setShowPicker] = useState(false);

    const selectedLaptops = useMemo(() => {
        return selectedIds.map(id => inventory.find(l => l.id === id)).filter(Boolean) as Laptop[];
    }, [selectedIds, inventory]);

    const addLaptop = (id: string) => {
        if (selectedIds.length < 3 && !selectedIds.includes(id)) {
            setSelectedIds(prev => [...prev, id]);
        }
        setShowPicker(false);
    };

    const removeLaptop = (id: string) => {
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    const specRows = [
        { label: 'Brand', getValue: (l: Laptop) => l.brand },
        { label: 'Category', getValue: (l: Laptop) => l.category },
        { label: 'Condition', getValue: (l: Laptop) => l.condition },
        { label: 'Specs', getValue: (l: Laptop) => l.specs },
        { label: 'Price', getValue: (l: Laptop) => formatPrice(l.price) },
        { label: 'Original Price', getValue: (l: Laptop) => formatPrice(l.originalPrice) },
        { label: 'Savings', getValue: (l: Laptop) => formatPrice(l.originalPrice - l.price) },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 min-h-[70vh]">
            <Helmet>
                <title>Compare Laptops | Yustech Logic System</title>
                <meta name="description" content="Compare laptop specs, prices, and features side-by-side. Find the best laptop for your needs." />
            </Helmet>

            <Link to="/shop" className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-bold transition group mb-8">
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-emerald-50 transition">
                    <ArrowLeft size={20} />
                </div>
                Back to Shop
            </Link>

            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                    <Scale size={16} />
                    Compare
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Compare Laptops</h1>
                <p className="text-gray-500 font-medium">Select up to 3 laptops to compare side-by-side.</p>
            </div>

            {/* Selection Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                {[0, 1, 2].map(i => {
                    const laptop = selectedLaptops[i];
                    return (
                        <div key={i} className={`relative rounded-3xl border-2 ${laptop ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50'} p-6 flex flex-col items-center justify-center min-h-[200px] transition-all`}>
                            {laptop ? (
                                <>
                                    <button
                                        onClick={() => removeLaptop(laptop.id)}
                                        className="absolute top-3 right-3 bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-200 transition"
                                    >
                                        <X size={14} />
                                    </button>
                                    <img src={laptop.image || undefined} alt={laptop.name} className="w-24 h-24 object-cover rounded-xl mb-4" />
                                    <h3 className="font-black text-sm text-gray-900 text-center">{laptop.name}</h3>
                                    <p className="text-tech-blue font-black text-lg mt-2">{formatPrice(laptop.price)}</p>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowPicker(true)}
                                    className="flex flex-col items-center gap-3 text-gray-400 hover:text-brand-primary transition"
                                >
                                    <div className="w-14 h-14 border-2 border-dashed border-current rounded-full flex items-center justify-center">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">Add Laptop</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Comparison Table */}
            {selectedLaptops.length >= 2 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-40">Spec</th>
                                    {selectedLaptops.map(l => (
                                        <th key={l.id} className="text-left px-6 py-4 text-sm font-black text-gray-900">{l.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {specRows.map((row, i) => (
                                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                        <td className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{row.label}</td>
                                        {selectedLaptops.map(l => (
                                            <td key={l.id} className="px-6 py-4 text-sm font-bold text-gray-900">{row.getValue(l)}</td>
                                        ))}
                                    </tr>
                                ))}
                                {/* Detailed Specs */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest align-top">Details</td>
                                    {selectedLaptops.map(l => (
                                        <td key={l.id} className="px-6 py-4">
                                            <ul className="space-y-1">
                                                {l.detailedSpecs?.map((s, i) => (
                                                    <li key={i} className="text-xs text-gray-600 font-medium">• {s}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add to Cart Buttons */}
            {selectedLaptops.length >= 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedLaptops.map(l => (
                        <button
                            key={l.id}
                            onClick={() => addToCart(l)}
                            className="flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-2xl font-black text-sm hover:bg-brand-dark transition active:scale-95 shadow-lg"
                        >
                            <ShoppingCart size={18} />
                            Add {l.brand} to Cart
                        </button>
                    ))}
                </div>
            )}

            {selectedLaptops.length < 2 && selectedLaptops.length > 0 && (
                <div className="text-center text-gray-400 text-sm font-bold py-8">
                    Select at least 2 laptops to see the comparison table.
                </div>
            )}

            {/* Laptop Picker Modal */}
            {showPicker && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowPicker(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900">Choose a Laptop</h3>
                            <button onClick={() => setShowPicker(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {inventory
                                .filter(l => !selectedIds.includes(l.id))
                                .map(l => (
                                    <button
                                        key={l.id}
                                        onClick={() => addLaptop(l.id)}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-emerald-50 hover:border-brand-primary transition text-left"
                                    >
                                        <img src={l.image || undefined} alt={l.name} className="w-14 h-14 object-cover rounded-xl" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-sm text-gray-900">{l.name}</p>
                                            <p className="text-xs text-gray-500">{l.specs}</p>
                                        </div>
                                        <span className="text-tech-blue font-black text-sm">{formatPrice(l.price)}</span>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;
