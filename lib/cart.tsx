'use client';
import React, { useContext, createContext, useReducer, useEffect } from "react";

export type Product = {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  images: { src: string }[];
};

export type CartItem = Product & { quantity: number };
export type CartState = { items: CartItem[] };
export type CartAction =
  | { type: "add"; product: Product }
  | { type: "remove"; id: number }
  | { type: "increment"; id: number }
  | { type: "decrement"; id: number }
  | { type: "clear" }
  | { type: "load"; items: CartItem[] }; // load action

const CartContext = createContext<
  (CartState & {
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    increment: (id: number) => void;
    decrement: (id: number) => void;
    clear: () => void;
  }) | undefined
>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const exists = state.items.find((i) => i.id === action.product.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "increment":
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case "decrement":
      return {
        items: state.items
          .map((i) =>
            i.id === action.id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "clear":
      return { items: [] };
    case "load":
      return { items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      dispatch({ type: "load", items: JSON.parse(stored) });
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Product) => dispatch({ type: "add", product });
  const removeFromCart = (id: number) => dispatch({ type: "remove", id });
  const increment = (id: number) => dispatch({ type: "increment", id });
  const decrement = (id: number) => dispatch({ type: "decrement", id });
  const clear = () => dispatch({ type: "clear" });

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
