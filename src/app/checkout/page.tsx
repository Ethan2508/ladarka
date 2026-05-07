"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Truck, Store, ArrowRight, Lock, Apple } from "lucide-react";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { nextOrderNumber, useOrders, type OrderType } from "@/lib/orders-store";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";

const SLOTS = [
  "ASAP (≈ 25 min)",
  "12h00",
  "12h30",
  "13h00",
  "19h30",
  "20h00",
  "20h30",
  "21h00",
];

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clear);
  const orders = useOrders((s) => s.orders);
  const addOrder = useOrders((s) => s.add);

  const [type, setType] = useState<OrderType>("DELIVERY");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [notes, setNotes] = useState("");
  const [paying, setPaying] = useState(false);

  const subtotal = cartSubtotal(lines);
  const deliveryFee = type === "DELIVERY" ? (subtotal >= 25 ? 0 : 3.5) : 0;
  const total = subtotal + deliveryFee;

  if (lines.length === 0 && !paying) {
    return (
      <div className="max-w-xl mx-auto px-5 py-32 text-center">
        <h1 className="font-display text-4xl">Panier vide</h1>
        <p className="mt-3 text-muted">Ajoute des plats avant de passer commande.</p>
        <Link
          href="/menu"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[color:var(--accent)] text-black font-medium"
        >
          Voir le menu <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !email || (type === "DELIVERY" && !address)) {
      toast.error("Remplis les infos requises");
      return;
    }
    setPaying(true);
    // Simulate Stripe redirect
    toast.loading("Paiement sécurisé en cours…", { id: "pay" });
    setTimeout(() => {
      const number = nextOrderNumber(orders);
      const now = new Date().toISOString();
      addOrder({
        number,
        type,
        status: "PAID",
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        address: type === "DELIVERY" ? address : undefined,
        scheduledAt: slot,
        notes,
        items: lines,
        subtotal,
        deliveryFee,
        total,
        createdAt: now,
        paidAt: now,
        statusHistory: [{ status: "PAID", at: now }],
      });
      clearCart();
      toast.success("Commande payée !", { id: "pay" });
      router.push(`/commande/${number}`);
    }, 1600);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 md:py-20">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
          ✦ Checkout
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">Dernière étape.</h1>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Type */}
          <Card title="Mode de récupération">
            <div className="grid grid-cols-2 gap-3">
              <TypeButton
                active={type === "DELIVERY"}
                onClick={() => setType("DELIVERY")}
                icon={<Truck size={20} />}
                label="Livraison Lyon"
                sub="≈ 30–45 min · 3,50 € (offerte dès 25 €)"
              />
              <TypeButton
                active={type === "PICKUP"}
                onClick={() => setType("PICKUP")}
                icon={<Store size={20} />}
                label="Click & collect"
                sub="≈ 20 min sur place · gratuit"
              />
            </div>
          </Card>

          {/* Contact */}
          <Card title="Tes infos">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Prénom & nom" value={name} onChange={setName} required />
              <Input label="Téléphone" value={phone} onChange={setPhone} required />
              <Input
                className="sm:col-span-2"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
              {type === "DELIVERY" && (
                <Input
                  className="sm:col-span-2"
                  label="Adresse de livraison (Lyon)"
                  value={address}
                  onChange={setAddress}
                  required
                />
              )}
            </div>
          </Card>

          {/* Slot */}
          <Card title="Quand ?">
            <div className="flex flex-wrap gap-2">
              {SLOTS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSlot(s)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-colors",
                    slot === s
                      ? "bg-[color:var(--accent)] text-black border-[color:var(--accent)]"
                      : "bg-[color:var(--surface)] border-[color:var(--border)] text-muted hover:text-text"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Note pour le resto (optionnel)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Allergies, étage, préférences…"
              className="w-full px-4 py-3 rounded-2xl bg-[color:var(--bg)] border border-[color:var(--border)] focus:border-[color:var(--accent)] outline-none text-sm placeholder:text-muted resize-none"
            />
          </Card>
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] overflow-hidden">
            <div className="p-6 border-b border-[color:var(--border)]">
              <h3 className="font-display text-xl">Récap</h3>
            </div>
            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
              {lines.map((l) => (
                <div key={l.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[color:var(--bg)] shrink-0">
                    {l.image ? (
                      <Image src={l.image} alt={l.name} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">🍔</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{l.name}</p>
                    <p className="text-xs text-muted">× {l.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice((l.unitPrice + l.optionsExtra) * l.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-[color:var(--border)] space-y-2 text-sm">
              <Row label="Sous-total" value={formatPrice(subtotal)} />
              <Row
                label={type === "DELIVERY" ? "Livraison" : "Retrait"}
                value={deliveryFee === 0 ? "Offerte" : formatPrice(deliveryFee)}
              />
              <div className="flex items-baseline justify-between pt-3 border-t border-[color:var(--border)]">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-3xl text-[color:var(--accent)]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={paying}
            whileTap={{ scale: 0.97 }}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-5 rounded-full bg-[color:var(--accent)] text-black font-semibold text-lg disabled:opacity-60"
          >
            {paying ? "Paiement en cours…" : (
              <>Payer {formatPrice(total)} <ArrowRight size={18} /></>
            )}
          </motion.button>
          <div className="flex items-center justify-center gap-3 text-xs text-muted">
            <Lock size={12} /> Paiement sécurisé · Apple Pay <Apple size={12} /> · Visa · Mastercard
          </div>
        </aside>
      </form>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6 md:p-8">
      <h2 className="font-display text-2xl mb-5">{title}</h2>
      {children}
    </section>
  );
}

function TypeButton({
  active,
  onClick,
  icon,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left p-5 rounded-2xl border transition-all",
        active
          ? "bg-[color:var(--accent)]/10 border-[color:var(--accent)]"
          : "bg-[color:var(--bg)] border-[color:var(--border)] hover:border-[color:var(--text)]"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full inline-flex items-center justify-center mb-3",
          active ? "bg-[color:var(--accent)] text-black" : "bg-[color:var(--surface-2)]"
        )}
      >
        {icon}
      </div>
      <p className="font-medium">{label}</p>
      <p className="text-xs text-muted mt-1">{sub}</p>
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-xs uppercase tracking-wider text-muted mb-2">
        {label} {required && <span className="text-[color:var(--accent)]">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-2xl bg-[color:var(--bg)] border border-[color:var(--border)] focus:border-[color:var(--accent)] outline-none text-sm"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted">
      <span>{label}</span>
      <span className="text-text">{value}</span>
    </div>
  );
}
