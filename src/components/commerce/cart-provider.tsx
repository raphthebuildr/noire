"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { Product, Variant } from "@/lib/catalog";
import { getColorImage } from "@/lib/catalog";

export type CartLine = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  color: string;
  size: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  isOpen: boolean;
  count: number;
  subtotal: number;
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "noire-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        typeof line?.variantId === "string" &&
        typeof line?.quantity === "number" &&
        line.quantity > 0,
    );
  } catch {
    return [];
  }
}

function subscribeToHydration() {
  return () => {};
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === "undefined" ? [] : readStoredCart(),
  );
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [hydrated, lines]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const addItem = useCallback(
    (product: Product, variant: Variant, quantity = 1) => {
      setLines((current) => {
        const existing = current.find(
          (line) => line.variantId === variant.id,
        );
        if (existing) {
          return current.map((line) =>
            line.variantId === variant.id
              ? {
                  ...line,
                  quantity: Math.min(
                    line.quantity + quantity,
                    line.maxQuantity,
                  ),
                }
              : line,
          );
        }

        return [
          ...current,
          {
            variantId: variant.id,
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            color: variant.color,
            size: variant.size,
            image: getColorImage(product, variant.color),
            price: product.price,
            quantity: Math.min(quantity, variant.stock),
            maxQuantity: variant.stock,
          },
        ];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((variantId: string) => {
    setLines((current) =>
      current.filter((line) => line.variantId !== variantId),
    );
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((current) =>
      current
        .map((line) =>
          line.variantId === variantId
            ? {
                ...line,
                quantity: Math.max(
                  0,
                  Math.min(quantity, line.maxQuantity),
                ),
              }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce(
      (total, line) => total + line.price * line.quantity,
      0,
    );

    return {
      lines,
      hydrated,
      isOpen,
      count,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    };
  }, [
    addItem,
    clearCart,
    closeCart,
    hydrated,
    isOpen,
    lines,
    openCart,
    removeItem,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
