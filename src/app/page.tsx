import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Sparkles } from "lucide-react";
import { PRODUCTS, bestsellers, CATEGORIES } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function HomePage() {
  const tops = bestsellers();
  const featured = PRODUCTS.filter((p) =>
    ["smash-burger", "burger-foie-gras", "ailes-bbq-12", "tenders-10"].includes(p.slug)
  );
  const stars = [...tops, ...featured]
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "La Darka",
    description:
      "Smash burgers, ailes BBQ, sandwichs maison. Livraison Lyon & click & collect.",
    servesCuisine: ["American", "Street Food", "Burger"],
    priceRange: "€€",
    url: "https://ladarka.fr",
    image: "https://ladarka.fr/menu/smash-burger.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lyon",
      addressLocality: "Lyon",
      addressRegion: "Auvergne-Rhône-Alpes",
      postalCode: "69000",
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: 45.764, longitude: 4.8357 },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1200" },
    acceptsReservations: false,
    hasMenu: "https://ladarka.fr/menu",
    areaServed: { "@type": "City", name: "Lyon" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Marquee />

      {/* About */}
      <section id="about" className="relative py-32 md:py-48">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <ScrollReveal className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
              ✦ Le concept
            </p>
            <h2 className="mt-6 font-display text-5xl md:text-7xl">
              La rue.<br />
              <span className="text-[color:var(--accent)]">En mieux.</span>
            </h2>
            <p className="mt-6 text-muted text-lg leading-relaxed max-w-md">
              On smashe le steak sur la plaque brûlante. On marine les ailes 24h.
              On fait nos sauces. On panique pas, on fait juste à manger comme
              il faut. Depuis Lyon.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[color:var(--accent)] text-black font-medium hover:scale-[1.03] transition-transform"
              >
                Voir la carte <ArrowRight size={16} />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-colors"
              >
                Nous trouver
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-7" delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                <Image
                  src="/menu/smash-burger.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mt-12">
                <Image
                  src="/menu/ailes-Poulet-BBQ.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[color:var(--border)]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--border)]">
          {[
            { k: "8 ans", v: "à Lyon" },
            { k: "+50k", v: "burgers servis" },
            { k: "100%", v: "fait maison" },
            { k: "20 min", v: "prêt à emporter" },
          ].map((s) => (
            <div key={s.k} className="px-4 py-12 text-center">
              <p className="font-display text-4xl md:text-6xl text-[color:var(--accent)]">
                {s.k}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="relative py-32 md:py-40">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                ✦ Les stars
              </p>
              <h2 className="mt-4 font-display text-5xl md:text-7xl">
                Best-sellers.
              </h2>
            </ScrollReveal>
            <Link
              href="/menu"
              className="hidden md:inline-flex items-center gap-2 text-sm text-muted hover:text-text"
            >
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stars.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 0.08}>
                <Link
                  href={`/menu/${p.slug}`}
                  className="group relative block aspect-[3/4] rounded-3xl overflow-hidden bg-[color:var(--surface)] lift"
                >
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl">
                      🍔
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[color:var(--accent)] text-black text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles size={10} /> Best
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-2">
                    <div>
                      <h3 className="font-display text-2xl leading-tight">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted line-clamp-1">
                        {p.description ?? "Le classique."}
                      </p>
                    </div>
                    <span className="font-display text-2xl text-[color:var(--accent)]">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-20 md:py-32 bg-[color:var(--surface)]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
              ✦ La carte
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl mb-12 md:mb-16">
              Trouve ton bonheur.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {CATEGORIES.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 0.04}>
                <Link
                  href={`/menu?cat=${c.slug}`}
                  className="group flex flex-col items-center justify-center aspect-square rounded-3xl bg-[color:var(--bg)] border border-[color:var(--border)] hover:border-[color:var(--accent)] hover:bg-[color:var(--surface-2)] transition-all"
                >
                  <span className="text-4xl md:text-5xl mb-3 transition-transform group-hover:scale-110">
                    {c.emoji}
                  </span>
                  <span className="font-display text-lg md:text-xl text-center px-2">
                    {c.name}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section className="py-32 md:py-40">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
              ✦ Comment ça marche
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl mb-12 md:mb-20">
              3 étapes.<br />Pas plus.
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {[
              { n: "01", t: "Choisis", d: "Parcours la carte. Personnalise ton burger, tes sauces, tout." },
              { n: "02", t: "Paye", d: "Paiement sécurisé Apple Pay, Google Pay ou CB en 2 clics." },
              { n: "03", t: "Suis ta commande", d: "Tu vois en direct quand on smashe ton steak. Click & collect ou livraison Lyon." },
            ].map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 0.1}>
                <div className="relative p-8 md:p-10 rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] h-full">
                  <p className="font-display text-7xl md:text-8xl text-[color:var(--accent)] opacity-30">
                    {s.n}
                  </p>
                  <h3 className="mt-4 font-display text-3xl">{s.t}</h3>
                  <p className="mt-3 text-muted leading-relaxed">{s.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="relative py-32 md:py-40 border-t border-[color:var(--border)]"
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
              ✦ Trouver
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl">
              On t&apos;attend<br />à Lyon.
            </h2>
            <div className="mt-10 space-y-5">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[color:var(--surface)] inline-flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[color:var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Adresse</p>
                  <p className="mt-1">Lyon — livraison toute la ville</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[color:var(--surface)] inline-flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-[color:var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Horaires</p>
                  <p className="mt-1">Lun–Dim · 11h30 → 23h</p>
                </div>
              </div>
            </div>
            <Link
              href="/menu"
              className="mt-12 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[color:var(--accent)] text-black font-semibold hover:scale-[1.03] transition-transform"
            >
              Commander maintenant <ArrowRight size={16} />
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-[color:var(--border)]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=4.78%2C45.74%2C4.90%2C45.78&layer=mapnik"
                className="w-full h-full"
                style={{ filter: "invert(0.92) hue-rotate(180deg) contrast(1.1)" }}
                loading="lazy"
                title="Lyon"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative w-4 h-4 rounded-full bg-[color:var(--accent)] pulse-dot" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
