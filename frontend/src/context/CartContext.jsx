import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  const value = { items, addItem, updateQuantity, removeItem, clear, totalItems, totalAmount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
