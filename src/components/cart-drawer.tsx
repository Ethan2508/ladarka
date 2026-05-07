"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove } = useCart();
  const subtotal = cartSubtotal(lines);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-[71] w-full sm:w-[440px] bg-[color:var(--surface)] border-l border-[color:var(--border)] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-[color:var(--border)]">
              <h2 className="font-display text-2xl">Ton panier</h2>
              <button
                onClick={close}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--surface-2)]"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <div className="w-20 h-20 rounded-full bg-[color:var(--surface-2)] inline-flex items-center justify-center">
                  <ShoppingBag size={28} className="text-muted" />
                </div>
                <p className="text-muted">Ton panier est vide.</p>
                <Link
                  href="/menu"
                  onClick={close}
                  className="mt-2 px-5 py-2.5 rounded-full bg-[color:var(--accent)] text-black text-sm font-medium"
                >
                  Voir le menu
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {lines.map((l) => (
                    <motion.div
                      key={l.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-3 p-3 rounded-2xl bg-[color:var(--surface-2)] border border-[color:var(--border)]"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[color:var(--bg)]">
                        {l.image ? (
                          <Image
                            src={l.image}
                            alt={l.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍔
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium leading-tight">
                            {l.name}
                          </h3>
                          <button
                            onClick={() => remove(l.id)}
                            className="text-muted hover:text-[color:var(--accent)] transition-colors"
                            aria-label="Retirer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {l.selectedOptions.length > 0 && (
                          <p className="mt-1 text-[11px] text-muted line-clamp-2">
                            {l.selectedOptions
                              .map((o) => o.choices.join(", "))
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 bg-[color:var(--bg)] rounded-full p-0.5">
                            <button
                              onClick={() => setQty(l.id, l.quantity - 1)}
                              className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--surface)]"
                              aria-label="Moins"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold w-5 text-center">
                              {l.quantity}
                            </span>
                            <button
                              onClick={() => setQty(l.id, l.quantity + 1)}
                              className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--surface)]"
                              aria-label="Plus"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(
                              (l.unitPrice + l.optionsExtra) * l.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-[color:var(--border)] p-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">Sous-total</span>
                    <span className="font-display text-3xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Livraison & taxes calculées à l&apos;étape suivante.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full bg-[color:var(--accent)] text-black font-semibold hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    Passer au paiement →
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
