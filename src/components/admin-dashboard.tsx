"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  ShoppingBag,
  Bike,
  Check,
  TrendingUp,
  Users,
  Receipt,
  Flame,
  Eye,
} from "lucide-react";
import {
  useOrders,
  STATUS_LABEL,
  type OrderStatus,
  type Order,
} from "@/lib/orders-store";
import { formatPrice, cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/menu";

const COLUMNS: { status: OrderStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { status: "PAID", label: "Nouvelles", icon: <Receipt size={14} />, color: "var(--accent-2)" },
  { status: "PREPARING", label: "En préparation", icon: <ChefHat size={14} />, color: "var(--accent)" },
  { status: "READY", label: "Prêtes / Livraison", icon: <ShoppingBag size={14} />, color: "var(--accent)" },
  { status: "DELIVERED", label: "Terminées", icon: <Check size={14} />, color: "var(--success)" },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PAID: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
  OUT_FOR_DELIVERY: "DELIVERED",
};

export function AdminDashboard() {
  const orders = useOrders((s) => s.orders);
  const setStatus = useOrders((s) => s.setStatus);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersToday = orders.filter((o) => new Date(o.createdAt) >= today);
  const revenueToday = ordersToday.reduce((s, o) => s + o.total, 0);
  const inProgress = orders.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  );

  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string; qty: number; image: string | null }> = {};
    orders.forEach((o) =>
      o.items.forEach((it) => {
        counts[it.slug] = counts[it.slug] ?? {
          name: it.name,
          qty: 0,
          image: it.image,
        };
        counts[it.slug].qty += it.quantity;
      })
    );
    return Object.entries(counts)
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[color:var(--bg)]/85 backdrop-blur-xl border-b border-[color:var(--border)]">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-display text-xl">
              La<span className="text-[color:var(--accent)]">Darka</span>
            </Link>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[color:var(--accent)]/15 text-[color:var(--accent)] uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-xs text-muted">
              <span className="w-2 h-2 rounded-full bg-[color:var(--success)] pulse-dot" />
              Resto ouvert
            </span>
            <Link
              href="/"
              className="text-sm text-muted hover:text-text inline-flex items-center gap-1"
            >
              <Eye size={14} /> Voir le site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">
              Cuisine en direct.
            </h1>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          <Kpi
            label="CA aujourd'hui"
            value={formatPrice(revenueToday)}
            icon={<TrendingUp size={16} />}
            accent
          />
          <Kpi
            label="Commandes jour"
            value={String(ordersToday.length)}
            icon={<Receipt size={16} />}
          />
          <Kpi
            label="En cours"
            value={String(inProgress.length)}
            icon={<Flame size={16} />}
          />
          <Kpi
            label="Clients"
            value={String(new Set(orders.map((o) => o.customerEmail)).size)}
            icon={<Users size={16} />}
          />
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const list = orders
              .filter((o) =>
                col.status === "READY"
                  ? o.status === "READY" || o.status === "OUT_FOR_DELIVERY"
                  : o.status === col.status
              )
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
            return (
              <div
                key={col.status}
                className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-4 min-h-[400px]"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full inline-flex items-center justify-center"
                      style={{ background: `${col.color}25`, color: col.color }}
                    >
                      {col.icon}
                    </div>
                    <h3 className="font-medium text-sm">{col.label}</h3>
                  </div>
                  <span className="text-xs text-muted">{list.length}</span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {list.length === 0 && (
                      <p className="text-xs text-muted text-center py-8">
                        Rien pour l&apos;instant
                      </p>
                    )}
                    {list.map((o) => (
                      <OrderCard
                        key={o.number}
                        order={o}
                        onAdvance={() => {
                          const n = NEXT_STATUS[o.status];
                          if (n) setStatus(o.number, n);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: top products + menu */}
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6">
            <h3 className="font-display text-2xl mb-5">Top produits</h3>
            <div className="space-y-3">
              {topProducts.map(([slug, p], i) => (
                <div key={slug} className="flex items-center gap-3">
                  <span className="font-display text-2xl text-[color:var(--accent)] w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[color:var(--bg)]">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">🍔</div>
                    )}
                  </div>
                  <p className="flex-1 text-sm font-medium truncate">{p.name}</p>
                  <span className="text-sm text-muted">× {p.qty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6">
            <h3 className="font-display text-2xl mb-2">Carte</h3>
            <p className="text-sm text-muted mb-5">
              {PRODUCTS.length} produits actifs · catalogue éditable.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PRODUCTS.slice(0, 8).map((p) =>
                p.image ? (
                  <div
                    key={p.slug}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    key={p.slug}
                    className="aspect-square rounded-xl bg-[color:var(--bg)] flex items-center justify-center text-2xl"
                  >
                    🍔
                  </div>
                )
              )}
            </div>
            <button className="mt-5 w-full text-sm text-muted hover:text-text border border-[color:var(--border)] rounded-full py-2.5">
              Gérer la carte (à brancher)
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-muted">
          Démo : les commandes avancent automatiquement quand tu les regardes côté client. Ici tu peux aussi les pousser manuellement.
        </p>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 md:p-5 border",
        accent
          ? "bg-[color:var(--accent)] text-black border-[color:var(--accent)]"
          : "bg-[color:var(--surface)] border-[color:var(--border)]"
      )}
    >
      <div className="flex items-center justify-between">
        <p className={cn("text-[10px] uppercase tracking-[0.2em]", accent ? "text-black/70" : "text-muted")}>
          {label}
        </p>
        {icon}
      </div>
      <p className="font-display text-3xl md:text-4xl mt-2">{value}</p>
    </div>
  );
}

function OrderCard({
  order,
  onAdvance,
}: {
  order: Order;
  onAdvance: () => void;
}) {
  const minutesAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)
  );
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 rounded-2xl bg-[color:var(--surface-2)] border border-[color:var(--border)] hover:border-[color:var(--accent)]/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">#{order.number}</p>
          <p className="text-[11px] text-muted">{order.customerName}</p>
        </div>
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
            order.type === "DELIVERY"
              ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
              : "bg-[color:var(--accent-2)]/15 text-[color:var(--accent-2)]"
          )}
        >
          {order.type === "DELIVERY" ? <Bike size={10} className="inline" /> : <ShoppingBag size={10} className="inline" />}{" "}
          {order.type === "DELIVERY" ? "Liv." : "Pickup"}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {order.items.slice(0, 3).map((it) => (
          <p key={it.id} className="text-xs text-muted truncate">
            <span className="text-text">{it.quantity}×</span> {it.name}
          </p>
        ))}
        {order.items.length > 3 && (
          <p className="text-[11px] text-muted">+ {order.items.length - 3} autre(s)</p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted">{minutesAgo} min</span>
        <span className="font-display text-lg">{formatPrice(order.total)}</span>
      </div>

      {NEXT_STATUS[order.status] && (
        <button
          onClick={onAdvance}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-[color:var(--accent)] text-black text-xs font-medium hover:scale-[1.02] transition-transform"
        >
          → {STATUS_LABEL[NEXT_STATUS[order.status] as OrderStatus]}
          <ArrowRight size={12} />
        </button>
      )}
    </motion.div>
  );
}
