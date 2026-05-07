"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Product } from "@/lib/menu";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [qty, setQty] = useState(1);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const add = useCart((s) => s.add);

  const optionsExtra = useMemo(() => {
    let total = 0;
    product.options?.forEach((opt) => {
      const picks = selections[opt.name] ?? [];
      picks.forEach((label) => {
        const choice = opt.choices.find((c) => c.label === label);
        if (choice?.priceModifier) total += choice.priceModifier;
      });
    });
    return total;
  }, [product, selections]);

  const requiredMet = useMemo(() => {
    return (product.options ?? [])
      .filter((o) => o.required)
      .every((o) => (selections[o.name]?.length ?? 0) > 0);
  }, [product, selections]);

  function toggle(optName: string, label: string, max: number, isMulti: boolean) {
    setSelections((prev) => {
      const cur = prev[optName] ?? [];
      if (cur.includes(label)) {
        return { ...prev, [optName]: cur.filter((l) => l !== label) };
      }
      if (!isMulti) return { ...prev, [optName]: [label] };
      if (cur.length >= max) return prev;
      return { ...prev, [optName]: [...cur, label] };
    });
  }

  function handleAdd() {
    if (!requiredMet) {
      toast.error("Sélectionne les options requises");
      return;
    }
    add({
      slug: product.slug,
      name: product.name,
      unitPrice: product.price,
      quantity: qty,
      image: product.image,
      selectedOptions: Object.entries(selections).map(([name, choices]) => ({
        name,
        choices,
      })),
      optionsExtra,
    });
    toast.success(`${qty} × ${product.name} ajouté`);
  }

  const total = (product.price + optionsExtra) * qty;

  return (
    <article className="pt-8 md:pt-12 pb-32">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8"
        >
          <ArrowLeft size={14} /> Retour à la carte
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-[color:var(--surface)] sticky top-24"
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl opacity-50">
                🍽️
              </div>
            )}
            {product.badge && (
              <span
                className={cn(
                  "absolute top-5 left-5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                  product.badge === "best" && "bg-[color:var(--accent)] text-black",
                  product.badge === "new" && "bg-[color:var(--accent-2)] text-black",
                  product.badge === "spicy" && "bg-red-600 text-white"
                )}
              >
                {product.badge === "best" && "★ Best-seller"}
                {product.badge === "new" && "Nouveau"}
                {product.badge === "spicy" && "🔥 Spicy"}
              </span>
            )}
          </motion.div>

          {/* Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
              {product.category}
            </p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-4 font-display text-4xl text-[color:var(--accent)]">
              {formatPrice(product.price)}
            </p>
            {product.description && (
              <p className="mt-6 text-lg text-muted leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Options */}
            {product.options?.map((opt) => {
              const picks = selections[opt.name] ?? [];
              const max = opt.maxChoices ?? (opt.type === "MULTI" ? 99 : 1);
              return (
                <div key={opt.name} className="mt-10">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-display text-xl">
                      {opt.name}
                      {opt.required && (
                        <span className="ml-2 text-xs text-[color:var(--accent)]">
                          • requis
                        </span>
                      )}
                    </h3>
                    {opt.type === "MULTI" && (
                      <span className="text-xs text-muted">
                        {picks.length} / {max}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {opt.choices.map((c) => {
                      const active = picks.includes(c.label);
                      const disabled =
                        !active &&
                        opt.type === "MULTI" &&
                        picks.length >= max;
                      return (
                        <button
                          key={c.label}
                          disabled={disabled}
                          onClick={() =>
                            toggle(opt.name, c.label, max, opt.type === "MULTI")
                          }
                          className={cn(
                            "relative px-4 py-3 rounded-2xl text-sm border transition-all text-left",
                            active
                              ? "bg-[color:var(--accent)]/10 border-[color:var(--accent)] text-text"
                              : "bg-[color:var(--surface)] border-[color:var(--border)] text-muted hover:text-text hover:border-[color:var(--text)]",
                            disabled && "opacity-40 cursor-not-allowed"
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span>{c.label}</span>
                            {active && (
                              <Check
                                size={14}
                                className="text-[color:var(--accent)]"
                              />
                            )}
                          </span>
                          {c.priceModifier ? (
                            <span className="block text-xs text-muted mt-0.5">
                              + {formatPrice(c.priceModifier)}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* CTA */}
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-1 bg-[color:var(--surface)] rounded-full p-1 border border-[color:var(--border)]">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 rounded-full inline-flex items-center justify-center hover:bg-[color:var(--surface-2)]"
                  aria-label="Moins"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 rounded-full inline-flex items-center justify-center hover:bg-[color:var(--surface-2)]"
                  aria-label="Plus"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 min-w-[240px] inline-flex items-center justify-between gap-3 px-6 py-4 rounded-full bg-[color:var(--accent)] text-black font-semibold hover:scale-[1.02] active:scale-95 transition-transform"
              >
                <span>Ajouter au panier</span>
                <span className="font-display text-xl">
                  {formatPrice(total)}
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-32 pt-16 border-t border-[color:var(--border)]">
            <h2 className="font-display text-3xl md:text-4xl mb-8">
              Tu aimerais aussi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/menu/${p.slug}`}
                  className="group block rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] overflow-hidden lift"
                >
                  <div className="relative aspect-square">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{p.name}</span>
                    <span className="text-sm text-[color:var(--accent)]">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
