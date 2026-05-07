"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./cart-store";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderType = "PICKUP" | "DELIVERY";

export type Order = {
  number: string; // human-friendly e.g. "DK-1042"
  type: OrderType;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address?: string;
  scheduledAt?: string; // ISO
  notes?: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  paidAt?: string;
  statusHistory: { status: OrderStatus; at: string }[];
};

const SEED_ORDERS: Order[] = [
  {
    number: "DK-1041",
    type: "DELIVERY",
    status: "DELIVERED",
    customerName: "Démo Client",
    customerPhone: "+33 6 12 34 56 78",
    customerEmail: "demo@ladarka.fr",
    address: "12 rue de la République, 69002 Lyon",
    items: [
      {
        id: "demo1",
        slug: "smash-burger",
        name: "Smash Burger",
        unitPrice: 16,
        quantity: 1,
        image: "/menu/smash-burger.jpg",
        selectedOptions: [
          { name: "Sauces au choix", choices: ["Darka", "BBQ"] },
        ],
        optionsExtra: 0,
      },
      {
        id: "demo2",
        slug: "ailes-bbq-6",
        name: 'Ailes de Poulet BBQ "6 Pièces"',
        unitPrice: 12,
        quantity: 1,
        image: "/menu/ailes-Poulet-BBQ.jpg",
        selectedOptions: [],
        optionsExtra: 0,
      },
    ],
    subtotal: 28,
    deliveryFee: 3.5,
    total: 31.5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    statusHistory: [
      { status: "PAID", at: new Date(Date.now() - 96 * 3600 * 1000).toISOString() },
      { status: "DELIVERED", at: new Date(Date.now() - 95 * 3600 * 1000).toISOString() },
    ],
  },
  {
    number: "DK-1038",
    type: "PICKUP",
    status: "DELIVERED",
    customerName: "Démo Client",
    customerPhone: "+33 6 12 34 56 78",
    customerEmail: "demo@ladarka.fr",
    items: [
      {
        id: "demo3",
        slug: "double-smash",
        name: "Double Smash Burger",
        unitPrice: 19,
        quantity: 2,
        image: "/menu/smash-burger.jpg",
        selectedOptions: [],
        optionsExtra: 0,
      },
      {
        id: "demo4",
        slug: "frites",
        name: "Frites Maison",
        unitPrice: 5,
        quantity: 1,
        image: "/menu/frites.jpg",
        selectedOptions: [],
        optionsExtra: 0,
      },
    ],
    subtotal: 43,
    deliveryFee: 0,
    total: 43,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    statusHistory: [],
  },
];

type OrderState = {
  orders: Order[];
  currentNumber: string | null;
  add: (order: Order) => void;
  setStatus: (number: string, status: OrderStatus) => void;
  setCurrent: (number: string | null) => void;
  reset: () => void;
};

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: SEED_ORDERS,
      currentNumber: null,
      add: (order) =>
        set((s) => ({
          orders: [order, ...s.orders],
          currentNumber: order.number,
        })),
      setStatus: (number, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.number === number
              ? {
                  ...o,
                  status,
                  statusHistory: [
                    ...o.statusHistory,
                    { status, at: new Date().toISOString() },
                  ],
                }
              : o
          ),
        })),
      setCurrent: (n) => set({ currentNumber: n }),
      reset: () => set({ orders: SEED_ORDERS, currentNumber: null }),
    }),
    { name: "ladarka-orders" }
  )
);

export function nextOrderNumber(existing: Order[]): string {
  const max = existing.reduce((m, o) => {
    const n = parseInt(o.number.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 1041);
  return `DK-${max + 1}`;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  PREPARING: "En préparation",
  READY: "Prête",
  OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const PICKUP_FLOW: OrderStatus[] = [
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED",
];
export const DELIVERY_FLOW: OrderStatus[] = [
  "PAID",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];
