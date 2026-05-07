"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Phone, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;

  return (
    <footer className="relative z-[2] border-t border-[color:var(--border)] bg-[color:var(--bg)]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/logo-blanc.png"
                alt="La Darka"
                width="400"
                height="400"
                className="h-24 md:h-32 w-auto"
              />
            </Link>
            <p className="mt-6 text-muted max-w-md">
              Le goût de la rue, version premium. Smash burgers, ailes BBQ et
              sandwichs maison à Lyon.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-text"
            >
              <Instagram size={16} /> @ladarka.lyon
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Trouver
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-[color:var(--accent)] shrink-0 mt-0.5" />
                <span>Lyon — livraison sur toute la ville</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-[color:var(--accent)] shrink-0 mt-0.5" />
                <a href="tel:+33000000000" className="hover:text-text text-muted">
                  +33 (0)0 00 00 00 00
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-[color:var(--accent)] shrink-0 mt-0.5" />
                <span className="text-muted">Lun–Dim · 11h30 — 23h</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Menu
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="text-muted hover:text-text">Carte</Link></li>
              <li><Link href="/menu?cat=burgers" className="text-muted hover:text-text">Burgers</Link></li>
              <li><Link href="/menu?cat=entrees" className="text-muted hover:text-text">Entrées</Link></li>
              <li><Link href="/menu?cat=sauces" className="text-muted hover:text-text">Sauces</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Compte
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/compte" className="text-muted hover:text-text">Mon compte</Link></li>
              <li><Link href="/compte/commandes" className="text-muted hover:text-text">Mes commandes</Link></li>
              <li><Link href="/admin" className="text-muted hover:text-text">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[color:var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} La Darka — Tous droits réservés.
          </p>
          <p className="text-xs text-muted">
            Site refait par{" "}
            <a
              href="https://stapes.fr"
              target="_blank"
              rel="noreferrer"
              className="text-text hover:text-[color:var(--accent)] transition-colors"
            >
              stapes.fr
            </a>
            .
          </p>
        </div>
      </div>

      {/* huge vanity word */}
      <div className="overflow-hidden -mt-8 select-none pointer-events-none">
        <p className="font-display text-[22vw] leading-[0.85] text-center text-[color:var(--surface)] tracking-tighter">
          DARKA
        </p>
      </div>
    </footer>
  );
}
