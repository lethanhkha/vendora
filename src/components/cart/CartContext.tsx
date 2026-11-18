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

// Sample multi-vendor preloaded items matching Stitch Screen 3
const INITIAL_DEMO_ITEMS: CartItem[] = [
  {
    skuId: "demo-sku-1",
    productId: "demo-p-1",
    productTitle: "Bàn Phím Cơ Gỗ Óc Chó FAS (Minimalist Walnut 75%)",
    productSlug: "ban-phim-co-go-oc-cho-fas-75",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80",
    price: "1850000",
    quantity: 1,
    attributes: { switch: "Linear Red", layout: "ANSI 75%" },
    vendorId: "demo-v-1",
    vendorName: "KeebCraft VN",
    vendorSlug: "keebcraft-vn",
    vendorLocation: "Ba Đình, Hà Nội",
  },
  {
    skuId: "demo-sku-2",
    productId: "demo-p-2",
    productTitle: "Tấm Lót Bàn Làm Việc Da Bò Sáp Ý Thủ Công (Desk Mat 90x40cm)",
    productSlug: "tam-lot-ban-da-bo-sap-y-90x40",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
    price: "450000",
    quantity: 1,
    attributes: { color: "Nâu sáp cổ điển", size: "90x40cm" },
    vendorId: "demo-v-2",
    vendorName: "Aura Saigon Leather",
    vendorSlug: "aura-saigon-leather",
    vendorLocation: "Quận 1, TP. Hồ Chí Minh",
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_DEMO_ITEMS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vendora_cart");
      if (saved) {
        setItems(JSON.parse(saved));
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
