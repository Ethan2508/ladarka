"use client";

import Link from "next/link";
import Image from "next/image";
import { useOrders, STATUS_LABEL } from "@/lib/orders-store";
import { useCart } from "@/lib/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { Receipt, RefreshCcw, MapPin, User } from "lucide-react";
import { toast } from "sonner";

export default function ComptePage() {
  const orders = useOrders((s) => s.orders);
  const addToCart = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  function reorder(orderNumber: string) {
    const order = orders.find((o) => o.number === orderNumber);
    if (!order) return;
    order.items.forEach((it) =>
      addToCart({
        slug: it.slug,
        name: it.name,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        image: it.image,
        selectedOptions: it.selectedOptions,
        optionsExtra: it.optionsExtra,
      })
    );
    toast.success("Articles ajoutés au panier");
    open();
  }

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            ✦ Mon compte
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">
            Salut Démo.
          </h1>
        </div>
        <div className="flex gap-3">
          <Stat label="Commandes" value={String(orders.length)} />
          <Stat label="Dépensé" value={formatPrice(totalSpent)} />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <QuickLink icon={<Receipt size={18} />} title="Mes commandes" sub={`${orders.length} commande${orders.length > 1 ? "s" : ""}`} />
        <QuickLink icon={<MapPin size={18} />} title="Mes adresses" sub="1 adresse enregistrée" />
        <QuickLink icon={<User size={18} />} title="Profil" sub="Infos & préférences" />
      </div>

      {/* Orders */}
      <h2 className="font-display text-3xl mb-6">Historique</h2>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-muted py-12 text-center">Aucune commande pour l&apos;instant.</p>
        ) : (
          orders.map((o) => (
            <div
              key={o.number}
              className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-3 items-start">
                  <div className="flex -space-x-3">
                    {o.items.slice(0, 3).map((it, i) =>
                      it.image ? (
                        <div
                          key={i}
                          className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-[color:var(--surface)] bg-[color:var(--bg)]"
                        >
                          <Image
                            src={it.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-2xl bg-[color:var(--surface-2)] border-2 border-[color:var(--surface)] inline-flex items-center justify-center"
                        >
                          🍔
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <p className="font-medium">#{o.number}</p>
                    <p className="text-xs text-muted">
                      {new Date(o.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {o.items.length} article{o.items.length > 1 ? "s" : ""}
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                        o.status === "DELIVERED"
                          ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                          : "bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
                      )}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-xl">{formatPrice(o.total)}</span>
                  <button
                    onClick={() => reorder(o.number)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--surface-2)] hover:bg-[color:var(--accent)] hover:text-black text-sm transition-colors"
                  >
                    <RefreshCcw size={14} /> Recommander
                  </button>
                  <Link
                    href={`/commande/${o.number}`}
                    className="text-sm text-muted hover:text-text"
                  >
                    Détail →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="font-display text-2xl">{value}</p>
    </div>
  );
}

function QuickLink({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6 hover:border-[color:var(--accent)]/50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-[color:var(--accent)]/15 text-[color:var(--accent)] inline-flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="font-medium">{title}</p>
      <p className="text-xs text-muted mt-1">{sub}</p>
    </div>
  );
}
