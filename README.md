# La Darka — démo e-commerce

Site de démo (cold pitch) pour **La Darka**, burgers / street-food à Lyon.
Front-end Next.js avec un parcours e-commerce complet **simulé côté client**.

> ⚠️ Démo persuasive : tout l'arrière-boutique (panier, commandes, suivi, admin)
> est mocké en local via Zustand. Aucun paiement ni email réels.

---

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript strict**
- **Tailwind CSS v4** (`@theme inline` + variables CSS), thème dark "Braise & Béton"
- **Zustand** (panier `ladarka-cart` + commandes `ladarka-orders`, persist localStorage)
- **Framer Motion** (parallax hero, transitions, scroll reveal)
- **Lenis** (smooth scroll)
- **lucide-react**, **sonner** (toasts), **clsx**, **tailwind-merge**

## Démarrer

```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build && pnpm start
```

Node ≥ 20, pnpm ≥ 9.

## Routes

| Route | Description |
| --- | --- |
| `/` | Hero parallax, marquee, à propos, bestsellers, catégories, "comment ça marche", contact + carte Lyon |
| `/menu` | Catalogue (recherche + filtres catégorie via `?cat=`) |
| `/menu/[slug]` | Fiche produit (options sauces, frites, quantité) |
| `/checkout` | Tunnel commande **simulé** (livraison/retrait, créneaux, notes) |
| `/commande/[number]` | Suivi temps réel mocké (statut auto-progresse toutes les 9 s) |
| `/compte` | Espace client mocké (historique, "réessayer" recommande le panier) |
| `/admin` | Kanban commandes mocké (PAID → PREPARING → READY/OUT → DELIVERED) |

## Ce qui est faké

- Paiement Stripe → 1.6 s loading + toast → commande créée
- Emails / SMS / auth → aucun
- Suivi commande → `setTimeout` qui avance le statut
- "Salut Démo" sur `/compte`, pas de vrai login

## Ce qui est réel

- Design system + animations
- Catalogue ~45 produits / 10 catégories (`src/lib/menu.ts`)
- Panier persistant (localStorage)
- Recherche, filtres, options produit, calcul du sous-total et frais de livraison
- SEO de base : `sitemap.ts`, `robots.ts`, JSON-LD `Restaurant`, OG image dynamique

## Pistes pour passer en prod

- Auth Supabase (magic link) + table `users`
- Stripe Checkout + webhooks → commandes en base (Supabase / Prisma)
- Resend ou SMTP pour les emails de confirmation
- Twilio / SMS pour notification "prêt à être retiré"
- Suivi temps réel via Supabase Realtime
- PWA + push notifications
- i18n FR / HE
- Codes promo, programme fidélité
- Dashboard admin avec rôles + auth

## Crédits visuels

Photos produits issues de `ladarka.fr` (WP uploads), utilisées pour la démo.
