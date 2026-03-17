
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Laptop, CartItem } from '../types';
import { LAPTOPS } from '../constants';
import { supabase } from '../services/supabaseClient';

interface CartContextType {
  cart: CartItem[];
  addToCart: (laptop: Laptop) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  recentlyViewed: Laptop[];
  addToRecentlyViewed: (laptop: Laptop) => void;
  wishlist: Laptop[];
  toggleWishlist: (laptop: Laptop) => void;
  isInWishlist: (id: string) => boolean;
  inventory: Laptop[];
  deleteInventoryItem: (id: string) => void;
  updateInventoryPrice: (id: string, newPrice: number) => void;
  addInventoryItem: (laptop: Laptop) => void;
  isPullToRefreshDisabled: boolean;
  setIsPullToRefreshDisabled: (disabled: boolean) => void;
  refreshInventory: () => Promise<void>;
  isInventoryLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wonderful_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Laptop[]>([]);
  const [wishlist, setWishlist] = useState<Laptop[]>([]);

  // Initialize inventory immediately with built-in data so catalog is NEVER blank
  // Supabase data will overlay this once loaded
  const [inventory, setInventory] = useState<Laptop[]>(LAPTOPS);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  const [isPullToRefreshDisabled, setIsPullToRefreshDisabled] = useState(false);

  // Load initial IDs from localStorage
  useEffect(() => {
    const savedRecentIds = localStorage.getItem('wonderful_autos_recent_ids');
    const savedWishlistIds = localStorage.getItem('wonderful_autos_wishlist_ids');

    if (inventory.length > 0) {
      if (savedRecentIds) {
        const ids = JSON.parse(savedRecentIds) as string[];
        const resolved = ids.map(id => inventory.find(l => l.id === id)).filter(Boolean) as Laptop[];
        setRecentlyViewed(resolved);
      }
      if (savedWishlistIds) {
        const ids = JSON.parse(savedWishlistIds) as string[];
        const resolved = ids.map(id => inventory.find(l => l.id === id)).filter(Boolean) as Laptop[];
        setWishlist(resolved);
      }
    }
  }, [inventory]);

  const refreshInventory = useCallback(async () => {
    setIsInventoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('laptops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Show both live Supabase data and demo data so the store looks full
        setInventory([...data, ...LAPTOPS]);
      } else {
        // DB is empty — show the build-in LAPTOPS constant
        setInventory(LAPTOPS);
      }
    } catch (error) {
      console.error('Error fetching inventory from Supabase:', error);
      // Network or DB error — keep the built-in LAPTOPS constant already in state
      // Do NOT attempt to read from localStorage — it may be empty or corrupt on mobile
      setInventory(LAPTOPS);
    } finally {
      setIsInventoryLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInventory();
    // Clean up any stale inventory cache from localStorage.
    // Old versions wrote large base64 images here, which caused QuotaExceededError on mobile.
    localStorage.removeItem('wonderful_inventory_cache');
  }, [refreshInventory]);

  useEffect(() => {
    try {
      localStorage.setItem('wonderful_autos_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      const ids = recentlyViewed.map(l => l.id);
      localStorage.setItem('wonderful_autos_recent_ids', JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save recently viewed IDs to localStorage:', e);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      const ids = wishlist.map(l => l.id);
      localStorage.setItem('wonderful_autos_wishlist_ids', JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save wishlist IDs to localStorage:', e);
    }
  }, [wishlist]);

  // NOTE: We intentionally do NOT cache inventory in localStorage.
  // Inventory objects contain large base64 image strings that quickly
  // exceed the mobile localStorage quota (~5MB), causing silent write
  // failures and an empty catalog on next refresh. The LAPTOPS constant
  // is always a safe fallback, so no local cache is needed.

  const addToRecentlyViewed = useCallback((laptop: Laptop) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== laptop.id);
      return [laptop, ...filtered].slice(0, 5); // Limit to 5 to save memory/state space
    });
  }, []);

  const toggleWishlist = useCallback((laptop: Laptop) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === laptop.id);
      if (exists) {
        return prev.filter(item => item.id !== laptop.id);
      }
      return [...prev, laptop];
    });
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return wishlist.some(item => item.id === id);
  }, [wishlist]);

  const deleteInventoryItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('laptops').delete().eq('id', id);
      if (error) throw error;
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  const updateInventoryPrice = useCallback(async (id: string, newPrice: number) => {
    try {
      const { error } = await supabase.from('laptops').update({ price: newPrice }).eq('id', id);
      if (error) throw error;
      setInventory(prev => prev.map(item => item.id === id ? { ...item, price: newPrice } : item));
    } catch (error) {
      console.error('Error updating price:', error);
      setInventory(prev => prev.map(item => item.id === id ? { ...item, price: newPrice } : item));
    }
  }, []);

  const addInventoryItem = useCallback(async (laptop: Laptop) => {
    try {
      const { error } = await supabase.from('laptops').insert([laptop]);
      if (error) throw error;
      setInventory(prev => [laptop, ...prev]);
    } catch (error) {
      console.error('Error adding item:', error);
      setInventory(prev => [laptop, ...prev]);
    }
  }, []);

  const addToCart = useCallback((laptop: Laptop) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === laptop.id);
      if (existing) {
        return prev.map(item => item.id === laptop.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...laptop, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      recentlyViewed,
      addToRecentlyViewed,
      wishlist,
      toggleWishlist,
      isInWishlist,
      inventory,
      deleteInventoryItem,
      updateInventoryPrice,
      addInventoryItem,
      isPullToRefreshDisabled,
      setIsPullToRefreshDisabled,
      refreshInventory,
      isInventoryLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
