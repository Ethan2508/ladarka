"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu as MenuIcon, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, cartCount } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart-drawer";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/#about", label: "Le concept" },
  { href: "/#contact", label: "Trouver" },
  { href: "/compte", label: "Compte" },
];

export function Header() {
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.open);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = cartCount(lines);
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[color:var(--bg)]/75 backdrop-blur-xl border-b border-[color:var(--border)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/brand/logo-blanc.png"
              alt="La Darka"
              width="200"
              height="200"
              priority
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-muted hover:text-text transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/compte"
              className="hidden md:inline-flex w-10 h-10 items-center justify-center rounded-full hover:bg-[color:var(--surface)] transition-colors"
              aria-label="Mon compte"
            >
              <User size={18} />
            </Link>
            <button
              onClick={open}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--accent)] text-black font-medium text-sm hover:scale-[1.03] active:scale-95 transition-transform"
            >
              <ShoppingBag size={16} />
              <span className="hidden md:inline">Panier</span>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-black text-white text-[11px] font-bold"
                >
                  {count}
                </motion.span>
              )}
            </button>
            <button
              className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--surface)]"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden bg-[color:var(--bg)]/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-5 h-16">
              <span className="font-display text-2xl">
                La<span className="text-[color:var(--accent)]">Darka</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--surface)]"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col px-5 pt-8 gap-1">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-5 font-display text-4xl border-b border-[color:var(--border)]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
      <div className="h-16 md:h-20" />
    </>
  );
}
