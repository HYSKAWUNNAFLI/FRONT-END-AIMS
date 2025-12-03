import { createContext, useContext, useMemo, useState, type FC, type ReactNode } from 'react';
import { products } from '../data/products';
import type { Product } from '../types';

export type CartItem = { productId: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  lines: Array<CartItem & { product: Product }>;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (productId: string, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { productId, qty }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    setItems(prev =>
      prev
        .map(i => {
          if (i.productId !== productId) return i;
          const product = products.find(p => p.id === productId);
          const maxQty = product ? product.stock : qty;
          return { ...i, qty: Math.max(0, Math.min(maxQty, qty)) };
        })
        .filter(i => i.qty > 0),
    );
  };

  const removeItem = (productId: string) => setItems(prev => prev.filter(i => i.productId !== productId));
  const clear = () => setItems([]);

  const lines = useMemo(
    () =>
      items
        .map(item => {
          const product = products.find(p => p.id === item.productId);
          return product ? { ...item, product } : null;
        })
        .filter((x): x is CartItem & { product: Product } => Boolean(x)),
    [items],
  );

  const subtotal = useMemo(() => lines.reduce((acc, line) => acc + line.product.price * line.qty, 0), [lines]);
  const totalItems = useMemo(() => lines.reduce((acc, line) => acc + line.qty, 0), [lines]);

  const value: CartContextValue = { items, addItem, updateQty, removeItem, clear, lines, subtotal, totalItems };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
