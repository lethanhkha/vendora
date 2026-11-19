"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, calculateCartSummary, CartSummary } from "@/modules/cart/cart-service";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  clearCart: () => void;
  summary: CartSummary;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vendora_cart");
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        // Sanitize: strip out any legacy demo items that may have non-UUID ids
        const clean = parsed.filter((it) => it && it.skuId && !it.skuId.startsWith("demo-"));
        setItems(clean);
        if (clean.length !== parsed.length) {
          localStorage.setItem("vendora_cart", JSON.stringify(clean));
        }
      }
    } catch (e) {}
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("vendora_cart", JSON.stringify(newItems));
    } catch (e) {}
  };

  const addToCart = (newItem: CartItem) => {
    const existingIndex = items.findIndex((i) => i.skuId === newItem.skuId);
    if (existingIndex > -1) {
      const copy = [...items];
      copy[existingIndex].quantity += newItem.quantity;
      saveItems(copy);
    } else {
      saveItems([...items, newItem]);
    }
  };

  const removeFromCart = (skuId: string) => {
    saveItems(items.filter((i) => i.skuId !== skuId));
  };

  const updateQuantity = (skuId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(skuId);
      return;
    }
    saveItems(items.map((i) => (i.skuId === skuId ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    saveItems([]);
  };

  const summary = calculateCartSummary(items);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        summary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
