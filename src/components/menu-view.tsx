"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/menu";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function MenuView() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("cat") ?? "all";
  const [q, setQ] = useState("");
  const add = useCart((s) => s.add);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = cat === "all" || p.category === cat;
      const matchQ = q
        ? (p.name + " " + (p.description ?? "")).toLowerCase().includes(q.toLowerCase())
        : true;
      return matchCat && matchQ;
    });
  }, [cat, q]);

  const grouped = useMemo(() => {
    if (cat !== "all") return null;
    return CATEGORIES.map((c) => ({
      ...c,
      items: filtered.filter((p) => p.category === c.slug),
    })).filter((g) => g.items.length);
  }, [cat, filtered]);

  function setCat(slug: string) {
    const sp = new URLSearchParams(params.toString());
    if (slug === "all") sp.delete("cat");
    else sp.set("cat", slug);
    router.replace(`/menu${sp.toString() ? "?" + sp.toString() : ""}`, {
      scroll: false,
    });
  }

  function quickAdd(p: Product) {
    if (p.options && p.options.some((o) => o.required)) {
      router.push(`/menu/${p.slug}`);
      return;
    }
    add({
      slug: p.slug,
      name: p.name,
      unitPrice: p.price,
      quantity: 1,
      image: p.image,
      selectedOptions: [],
      optionsExtra: 0,
    });
    toast.success(`${p.name} ajouté au panier`);
  }

  return (
    <>
      {/* Header */}
      <section className="pt-12 md:pt-20 pb-8">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            ✦ La carte
          </p>
          <h1 className="mt-4 font-display text-6xl md:text-8xl">
            Le menu.
          </h1>
          <p className="mt-4 max-w-xl text-muted text-lg">
            {PRODUCTS.length} produits, faits maison à Lyon. Click &amp; collect ou livraison.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-[color:var(--bg)]/85 backdrop-blur-xl border-y border-[color:var(--border)]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-3 flex flex-col gap-3">
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Chercher un plat…"
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[color:var(--surface)] border border-[color:var(--border)] focus:border-[color:var(--accent)] outline-none text-sm placeholder:text-muted"
            />
          </div>
          <div className="-mx-5 md:-mx-8 px-5 md:px-8 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max">
              <CatPill active={cat === "all"} onClick={() => setCat("all")}>
                Tout
              </CatPill>
              {CATEGORIES.map((c) => (
                <CatPill
                  key={c.slug}
                  active={cat === c.slug}
                  onClick={() => setCat(c.slug)}
                >
                  <span>{c.emoji}</span> {c.name}
                </CatPill>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          {filtered.length === 0 && (
            <div className="text-center py-32 text-muted">
              <p className="font-display text-3xl">Pas de résultat.</p>
              <p className="mt-2 text-sm">Essaie un autre mot ou catégorie.</p>
            </div>
          )}

          {grouped ? (
            <div className="space-y-20">
              {grouped.map((g) => (
                <div key={g.slug}>
                  <h2 className="font-display text-4xl md:text-5xl mb-8 flex items-baseline gap-3">
                    <span className="text-2xl">{g.emoji}</span>
                    {g.name}
                    <span className="text-sm text-muted">
                      {g.items.length}
                    </span>
                  </h2>
                  <ProductGrid items={g.items} onAdd={quickAdd} />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid items={filtered} onAdd={quickAdd} />
          )}
        </div>
      </section>
    </>
  );
}

function CatPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all border",
        active
          ? "bg-[color:var(--accent)] text-black border-[color:var(--accent)] font-medium"
          : "bg-transparent border-[color:var(--border)] text-muted hover:text-text hover:border-[color:var(--text)]"
      )}
    >
      <span className="inline-flex items-center gap-1.5">{children}</span>
    </button>
  );
}

function ProductGrid({
  items,
  onAdd,
}: {
  items: Product[];
  onAdd: (p: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      <AnimatePresence mode="popLayout">
        {items.map((p, i) => (
          <motion.article
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.3) }}
            className="group relative rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] overflow-hidden hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <Link href={`/menu/${p.slug}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--surface-2)]">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">
                    🍽️
                  </div>
                )}
                {p.badge && (
                  <span
                    className={cn(
                      "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      p.badge === "best" && "bg-[color:var(--accent)] text-black",
                      p.badge === "new" && "bg-[color:var(--accent-2)] text-black",
                      p.badge === "spicy" && "bg-red-600 text-white"
                    )}
                  >
                    {p.badge === "best" && "★ Best"}
                    {p.badge === "new" && "Nouveau"}
                    {p.badge === "spicy" && "🔥 Hot"}
                  </span>
                )}
              </div>
              <div className="p-5 pb-14">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight">
                    {p.name}
                  </h3>
                  <span className="font-display text-xl text-[color:var(--accent)] shrink-0">
                    {formatPrice(p.price)}
                  </span>
                </div>
                {p.description && (
                  <p className="mt-2 text-sm text-muted line-clamp-2">
                    {p.description}
                  </p>
                )}
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAdd(p);
              }}
              className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-[color:var(--accent)] text-black inline-flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
              aria-label={`Ajouter ${p.name}`}
            >
              <Plus size={18} />
            </button>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}
