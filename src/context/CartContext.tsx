import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { products } from "../data/products";
import type { Product } from "../types";
import cartService from "../services/cartService";
import { getProductById } from "../services/productService";

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
  isLoading: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sessionKey = cartService.getSessionKey();

  // Load cart from backend on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await cartService.getCart(sessionKey);
        if (cart.items && cart.items.length > 0) {
          // Convert backend cart items to local format
          setItems(
            cart.items.map((item) => ({
              productId: String(item.productId),
              qty: item.quantity,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
        // Continue with empty cart
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [sessionKey]);

  const addItem = async (productId: string, qty = 1) => {
    try {
      // Get product details for price
      const product =
        products.find((p) => p.id === productId) ||
        (await getProductById(productId));
      if (!product) return;

      // Call backend
      await cartService.addItem(sessionKey, {
        productId: Number(productId),
        quantity: qty,
        price: product.price,
      });

      // Update local state
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, { productId, qty }];
      });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      // Fallback to local-only update
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, { productId, qty }];
      });
    }
  };

  const updateQty = async (productId: string, qty: number) => {
    if (qty <= 0) {
      // If quantity is 0 or less, remove the item
      return removeItem(productId);
    }

    try {
      const product =
        products.find((p) => p.id === productId) ||
        (await getProductById(productId));
      if (!product) return;

      const maxQty = product.stock;
      const finalQty = Math.max(0, Math.min(maxQty, qty));

      // Call backend
      await cartService.updateItem(sessionKey, {
        productId: Number(productId),
        quantity: finalQty,
        price: product.price,
      });

      // Update local state
      setItems((prev) =>
        prev
          .map((i) => (i.productId === productId ? { ...i, qty: finalQty } : i))
          .filter((i) => i.qty > 0)
      );
    } catch (err) {
      console.error("Failed to update cart item:", err);
      // Fallback to local-only update
      setItems((prev) =>
        prev
          .map((i) => {
            if (i.productId !== productId) return i;
            const product = products.find((p) => p.id === productId);
            const maxQty = product ? product.stock : qty;
            return { ...i, qty: Math.max(0, Math.min(maxQty, qty)) };
          })
          .filter((i) => i.qty > 0)
      );
    }
  };

  const removeItem = async (productId: string) => {
    try {
      // Find cart item ID (for now, use productId as cartItemId)
      // Note: You may need to store cart item IDs separately if backend provides them
      const cartItemId = Number(productId);
      await cartService.removeItem(sessionKey, cartItemId);

      // Update local state
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      // Fallback to local-only update
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    }
  };

  const clear = () => {
    setItems([]);
    cartService.clearSessionKey();
  };

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return product ? { ...item, product } : null;
        })
        .filter((x): x is CartItem & { product: Product } => Boolean(x)),
    [items]
  );

  const subtotal = useMemo(
    () => lines.reduce((acc, line) => acc + line.product.price * line.qty, 0),
    [lines]
  );
  const totalItems = useMemo(
    () => lines.reduce((acc, line) => acc + line.qty, 0),
    [lines]
  );

  const value: CartContextValue = {
    items,
    addItem,
    updateQty,
    removeItem,
    clear,
    lines,
    subtotal,
    totalItems,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
