"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Truck,
  Store,
  Phone,
  MapPin,
  Receipt,
  ArrowRight,
  ChefHat,
  ShoppingBag,
  Bike,
} from "lucide-react";
import {
  useOrders,
  STATUS_LABEL,
  PICKUP_FLOW,
  DELIVERY_FLOW,
  type OrderStatus,
} from "@/lib/orders-store";
import { formatPrice, cn } from "@/lib/utils";

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Clock size={16} />,
  PAID: <Receipt size={16} />,
  PREPARING: <ChefHat size={16} />,
  READY: <ShoppingBag size={16} />,
  OUT_FOR_DELIVERY: <Bike size={16} />,
  DELIVERED: <Check size={16} />,
  CANCELLED: <Clock size={16} />,
};

export function OrderTracking({ number }: { number: string }) {
  const order = useOrders((s) => s.orders.find((o) => o.number === number));
  const setStatus = useOrders((s) => s.setStatus);
  const [eta, setEta] = useState<number>(25);

  // Auto-progress simulation
  useEffect(() => {
    if (!order) return;
    if (order.status === "DELIVERED" || order.status === "CANCELLED") return;
    const flow = order.type === "PICKUP" ? PICKUP_FLOW : DELIVERY_FLOW;
    const idx = flow.indexOf(order.status);
    if (idx === -1 || idx >= flow.length - 1) return;
    const timer = setTimeout(() => {
      setStatus(order.number, flow[idx + 1]);
    }, 9000);
    return () => clearTimeout(timer);
  }, [order, setStatus]);

  // ETA countdown
  useEffect(() => {
    const t = setInterval(() => setEta((e) => Math.max(0, e - 1)), 60000);
    return () => clearInterval(t);
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-5 py-32 text-center">
        <h1 className="font-display text-4xl">Commande introuvable</h1>
        <p className="mt-3 text-muted">Le numéro {number} n&apos;existe pas.</p>
        <Link
          href="/menu"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[color:var(--accent)] text-black font-medium"
        >
          Retour au menu <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const flow = order.type === "PICKUP" ? PICKUP_FLOW : DELIVERY_FLOW;
  const currentIdx = flow.indexOf(order.status);
  const progress = currentIdx === -1 ? 0 : (currentIdx / (flow.length - 1)) * 100;

  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-12 md:py-16">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[color:var(--accent)]/15 via-[color:var(--surface)] to-[color:var(--surface-2)] p-8 md:p-12 border border-[color:var(--border)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[color:var(--success)] pulse-dot" />
              {order.status === "DELIVERED" ? "Livrée" : "En cours"}
            </p>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">
              Merci !
            </h1>
            <p className="mt-3 text-lg text-muted">
              Commande <span className="text-text font-semibold">#{order.number}</span> · {STATUS_LABEL[order.status]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {order.status === "DELIVERED" ? "Livrée" : "Estimation"}
            </p>
            <p className="font-display text-5xl md:text-6xl text-[color:var(--accent)] mt-2">
              {order.status === "DELIVERED"
                ? "✓"
                : order.type === "PICKUP"
                  ? `${eta}min`
                  : `${eta + 10}min`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-10 h-1.5 bg-[color:var(--bg)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-full bg-[color:var(--accent)]"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-10 grid md:grid-cols-4 gap-3">
        {flow.map((status, i) => {
          const passed = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "relative p-5 rounded-2xl border",
                passed
                  ? "bg-[color:var(--surface)] border-[color:var(--accent)]/40"
                  : "bg-[color:var(--surface)]/40 border-[color:var(--border)]"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full inline-flex items-center justify-center mb-3",
                  passed
                    ? "bg-[color:var(--accent)] text-black"
                    : "bg-[color:var(--surface-2)] text-muted",
                  active && "pulse-dot"
                )}
              >
                {STATUS_ICONS[status]}
              </div>
              <p className={cn("text-sm font-medium", !passed && "text-muted")}>
                {STATUS_LABEL[status]}
              </p>
              {active && (
                <p className="text-[11px] text-muted mt-1">en cours…</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6 md:p-8">
          <h2 className="font-display text-2xl mb-6">Ta commande</h2>
          <div className="space-y-4">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[color:var(--bg)]">
                  {it.image ? (
                    <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{it.name}</p>
                  {it.selectedOptions.length > 0 && (
                    <p className="text-xs text-muted truncate">
                      {it.selectedOptions
                        .map((o) => o.choices.join(", "))
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-muted mt-0.5">× {it.quantity}</p>
                </div>
                <span className="font-medium">
                  {formatPrice((it.unitPrice + it.optionsExtra) * it.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[color:var(--border)] space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{order.type === "DELIVERY" ? "Livraison" : "Retrait"}</span>
              <span>{order.deliveryFee === 0 ? "Offerte" : formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex items-baseline justify-between pt-3 border-t border-[color:var(--border)]">
              <span className="font-display text-lg">Total payé</span>
              <span className="font-display text-2xl text-[color:var(--accent)]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Mode</p>
            <p className="mt-2 font-medium flex items-center gap-2">
              {order.type === "DELIVERY" ? <Truck size={16} /> : <Store size={16} />}
              {order.type === "DELIVERY" ? "Livraison" : "Click & Collect"}
            </p>
            {order.address && (
              <p className="mt-3 text-sm text-muted flex gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                {order.address}
              </p>
            )}
            {order.scheduledAt && (
              <p className="mt-2 text-sm text-muted flex gap-2">
                <Clock size={14} className="shrink-0 mt-0.5" />
                {order.scheduledAt}
              </p>
            )}
          </div>

          <a
            href="tel:+33000000000"
            className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6 flex items-center gap-4 hover:border-[color:var(--accent)]"
          >
            <div className="w-12 h-12 rounded-full bg-[color:var(--accent)]/15 inline-flex items-center justify-center">
              <Phone size={18} className="text-[color:var(--accent)]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Un souci ?</p>
              <p className="font-medium">Appeler le resto</p>
            </div>
          </a>

          <Link
            href="/menu"
            className="block text-center rounded-3xl border border-[color:var(--border)] p-6 hover:border-[color:var(--accent)] text-muted hover:text-text"
          >
            Recommander quelque chose →
          </Link>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-muted">
        Démo : la commande progresse automatiquement pour la présentation. En prod : changements pilotés par l&apos;admin via Supabase Realtime.
      </p>
    </div>
  );
}
