import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PROMO_CODES } from '../lib/catalog';

/**
 * Shopping bag state, persisted to localStorage so the bag survives reloads.
 * Each line is identified by a stable key derived from the product + options,
 * so adding the same configuration twice simply bumps the quantity.
 */

const BagContext = createContext(null);
const STORAGE_KEY = 'ip15-bag-v1';
const ORDERS_KEY = 'ip15-orders-v1';
export const MAX_QTY = 10;

const load = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function BagProvider({ children }) {
  const [state, setState] = useState(() => load(STORAGE_KEY, { items: [], promo: null }));
  const [orders, setOrders] = useState(() => load(ORDERS_KEY, []));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) — bag still works in memory */
    }
  }, [state]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  const addItem = useCallback((item, qty = 1) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.key === item.key);
      const items = existing
        ? prev.items.map((i) => (i.key === item.key ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i))
        : [...prev.items, { ...item, qty }];
      return { ...prev, items };
    });
  }, []);

  const updateQty = useCallback((key, qty) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, MAX_QTY)) } : i)),
    }));
  }, []);

  const removeItem = useCallback((key) => {
    setState((prev) => ({ ...prev, items: prev.items.filter((i) => i.key !== key) }));
  }, []);

  const clear = useCallback(() => setState({ items: [], promo: null }), []);

  /** Returns `true` when the code was applied. */
  const applyPromo = useCallback((code) => {
    const normalized = code.trim().toUpperCase();
    if (!PROMO_CODES[normalized]) return false;
    setState((prev) => ({ ...prev, promo: normalized }));
    return true;
  }, []);

  const removePromo = useCallback(() => setState((prev) => ({ ...prev, promo: null })), []);

  const recordOrder = useCallback((order) => setOrders((prev) => [order, ...prev].slice(0, 20)), []);

  const value = useMemo(() => {
    const count = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const promo = state.promo ? { code: state.promo, ...PROMO_CODES[state.promo] } : null;
    const discount = promo ? Math.round(subtotal * promo.rate * 100) / 100 : 0;
    return {
      items: state.items,
      count,
      subtotal,
      promo,
      discount,
      orders,
      addItem,
      updateQty,
      removeItem,
      clear,
      applyPromo,
      removePromo,
      recordOrder,
    };
  }, [state, orders, addItem, updateQty, removeItem, clear, applyPromo, removePromo, recordOrder]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error('useBag must be used inside <BagProvider>');
  return ctx;
}
