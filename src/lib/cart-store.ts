"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  id: string; // unique per option-set
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string | null;
  selectedOptions: { name: string; choices: string[] }[];
  optionsExtra: number; // sum of priceModifiers
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: Omit<CartLine, "id"> & { id?: string }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

function lineKey(slug: string, opts: CartLine["selectedOptions"]): string {
  const opt = opts
    .map((o) => `${o.name}:${[...o.choices].sort().join(",")}`)
    .join("|");
  return `${slug}#${opt}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (line) =>
        set((state) => {
          const id = line.id ?? lineKey(line.slug, line.selectedOptions);
          const existing = state.lines.find((l) => l.id === id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === id ? { ...l, quantity: l.quantity + line.quantity } : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [...state.lines, { ...line, id }],
            isOpen: true,
          };
        }),
      remove: (id) =>
        set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.id !== id)
              : state.lines.map((l) => (l.id === id ? { ...l, quantity: qty } : l)),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "ladarka-cart" }
  )
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce(
    (sum, l) => sum + (l.unitPrice + l.optionsExtra) * l.quantity,
    0
  );
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
