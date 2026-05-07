"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] -mt-16 md:-mt-20 pt-16 md:pt-20 overflow-hidden"
    >
      {/* Big image */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/menu/smash-burger.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--bg)]/60 via-[color:var(--bg)]/40 to-[color:var(--bg)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--bg)]/80 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: titleY }}
        className="relative z-[2] max-w-[1400px] mx-auto px-5 md:px-8 pt-24 md:pt-40 pb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/60 backdrop-blur text-xs uppercase tracking-[0.2em] text-muted"
        >
          <span className="w-2 h-2 rounded-full bg-[color:var(--success)] pulse-dot" />
          Ouvert · Livraison Lyon en cours
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8 font-display text-[18vw] md:text-[14vw] lg:text-[11vw] leading-[0.85]"
        >
          Smash.
          <br />
          <span className="text-[color:var(--accent)] italic">Crispy.</span>
          <br />
          <span className="inline-flex items-baseline gap-4">
            Sauce.
            <span className="hidden md:inline-block w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden align-middle relative -mb-4">
              <Image
                src="/menu/sauce-darka.jpg"
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
            </span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 md:mt-16 grid md:grid-cols-12 gap-8 items-end"
        >
          <p className="md:col-span-6 text-lg md:text-xl text-muted leading-relaxed max-w-xl">
            La Darka c&apos;est <span className="text-text">le burger street-food</span>{" "}
            qu&apos;on attendait à Lyon. Smashé sur la plaque, sauces maison,
            frites cuites en deux temps. Click &amp; collect ou livraison.
          </p>
          <div className="md:col-span-6 flex flex-wrap items-center gap-4 md:justify-end">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[color:var(--accent)] text-black font-semibold hover:scale-[1.03] transition-transform"
            >
              <span className="text-base">Commander</span>
              <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center transition-transform group-hover:rotate-[-45deg]">
                <ArrowRight size={16} />
              </span>
            </Link>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[color:var(--surface)]/60 backdrop-blur border border-[color:var(--border)]">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[color:var(--accent-2)] text-[color:var(--accent-2)]"
                  />
                ))}
              </div>
              <span className="text-sm text-muted">
                <span className="text-text font-semibold">4,8</span> · 1200+ avis
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[color:var(--accent)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
