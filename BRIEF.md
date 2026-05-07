# 🎯 MISSION — Refonte complète de La Darka (web app e-commerce restauration)

Tu vas développer une **application web e-commerce complète** pour **La Darka**, restaurant de burgers / street-food. Le site actuel (https://ladarka.fr) est un WooCommerce daté mais avec des fonctionnalités e-commerce réelles (panier, paiement en ligne, comptes clients, suivi de commande, historique). Objectif : refaire **tout** en moderne, ultra rapide, avec un design "awwwards-grade", tout en gardant et améliorant les fonctionnalités e-commerce.

⚠️ Ce n'est PAS une simple landing page. C'est une **vraie application** avec auth, base de données, paiement, dashboard admin et suivi temps réel.

---

## 🧱 Stack technique

- **Framework** : Next.js 15 (App Router) + TypeScript strict
- **Styling** : Tailwind CSS v4 + shadcn/ui
- **DB** : PostgreSQL (Supabase ou Neon) + Prisma ORM
- **Auth** : Better-Auth (ou NextAuth v5) — email/password + magic link + Google OAuth
- **Paiement** : Stripe Checkout + Stripe Webhooks (Apple Pay / Google Pay activés)
- **Temps réel** : Supabase Realtime (ou Pusher) pour le suivi de commande live
- **State client** : Zustand pour le panier (persisté en localStorage + sync DB si user connecté)
- **Validation** : Zod (forms + API routes)
- **Forms** : react-hook-form + zod resolver
- **Animations** : Framer Motion + Lenis (smooth scroll)
- **Emails transactionnels** : Resend + React Email (confirmation commande, reset password, statut commande)
- **Notifications** : Sonner (toasts) + push web (optionnel)
- **Images** : `next/image` AVIF/WebP
- **SMS** (optionnel) : Twilio pour notifier le client quand la commande passe "Prête"
- **Déploiement** : Vercel + Supabase

---

## 🗄️ Schéma base de données (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  role          Role      @default(CUSTOMER)
  addresses     Address[]
  orders        Order[]
  createdAt     DateTime  @default(now())
}

enum Role { CUSTOMER ADMIN STAFF }

model Address {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  label     String  // "Maison", "Bureau"
  line1     String
  line2     String?
  city      String
  zip       String
  isDefault Boolean @default(false)
}

model Category {
  id       String    @id @default(cuid())
  slug     String    @unique
  name     String
  order    Int
  products Product[]
}

model Product {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String?
  price       Decimal   // €
  image       String?
  available   Boolean   @default(true)
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  options     ProductOption[]   // sauces au choix, garnitures, etc.
  orderItems  OrderItem[]
}

model ProductOption {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  name      String           // "Sauces au choix"
  type      OptionType       // SINGLE | MULTI
  required  Boolean @default(false)
  maxChoices Int?            // ex: 2 pour "2 sauces au choix"
  choices   OptionChoice[]
}

enum OptionType { SINGLE MULTI }

model OptionChoice {
  id            String @id @default(cuid())
  optionId      String
  option        ProductOption @relation(fields: [optionId], references: [id])
  label         String        // "BBQ", "Mayo"
  priceModifier Decimal @default(0)
}

model Order {
  id             String       @id @default(cuid())
  number         Int          @unique @default(autoincrement()) // pour affichage humain
  userId         String?
  user           User?        @relation(fields: [userId], references: [id])
  guestEmail     String?
  guestPhone     String?
  status         OrderStatus  @default(PENDING)
  type           OrderType    // PICKUP | DELIVERY
  addressId      String?
  scheduledAt    DateTime?    // commande planifiée
  items          OrderItem[]
  subtotal       Decimal
  deliveryFee    Decimal      @default(0)
  total          Decimal
  stripeSessionId String?
  stripePaymentIntent String?
  paidAt         DateTime?
  notes          String?
  statusHistory  StatusEvent[]
  createdAt      DateTime     @default(now())
}

enum OrderStatus { PENDING PAID PREPARING READY OUT_FOR_DELIVERY DELIVERED CANCELLED REFUNDED }
enum OrderType { PICKUP DELIVERY DINE_IN }

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id])
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  name        String  // snapshot
  unitPrice   Decimal // snapshot
  quantity    Int
  selectedOptions Json   // snapshot des options choisies
  lineTotal   Decimal
}

model StatusEvent {
  id        String @id @default(cuid())
  orderId   String
  order     Order  @relation(fields: [orderId], references: [id])
  status    OrderStatus
  message   String?
  createdAt DateTime @default(now())
}

model ShopSettings {
  id        Int     @id @default(1)
  isOpen    Boolean @default(true)
  openHours Json    // par jour
  pickupEnabled  Boolean @default(true)
  deliveryEnabled Boolean @default(true)
  minOrderDelivery Decimal @default(0)
  deliveryFee Decimal @default(0)
  prepTimeMinutes Int @default(20)
}
```

---

## 🛣️ Routes & arborescence

### Public
- `/` — Hero, à propos, best-sellers, comment commander, localisation
- `/menu` — Catalogue complet (filtres par catégorie, recherche, tri)
- `/menu/[slug]` — Fiche produit (image full-bleed, description, options, qty, ajout panier)
- `/panier` — Récap panier, modification quantités/options, code promo, total
- `/checkout` — Choix pickup/livraison, adresse, créneau, notes, → Stripe Checkout
- `/checkout/success?session_id=…` — Confirmation + redirection vers suivi
- `/commande/[number]` — **Suivi temps réel** avec timeline (Payée → En préparation → Prête → Livrée), ETA, bouton appeler le resto
- `/login` `/register` `/reset-password`
- `/compte` — Dashboard utilisateur
  - `/compte/commandes` — Historique avec filtres (statut, date)
  - `/compte/commandes/[number]` — Détail + bouton "Recommander" (re-fill panier)
  - `/compte/adresses` — CRUD adresses
  - `/compte/profil` — Infos perso, mot de passe, préférences notifications
- `/contact` `/mentions-legales` `/cgv` `/politique-confidentialite`

### Admin (`/admin`, role ADMIN/STAFF)
- `/admin` — Dashboard (CA jour/semaine, commandes en cours, top produits)
- `/admin/commandes` — Kanban temps réel (Payée / En prép / Prête / Livrée), bouton changer statut
- `/admin/commandes/[id]` — Détail commande + impression ticket
- `/admin/produits` — CRUD produits + options + upload image
- `/admin/categories` — Réorganiser
- `/admin/clients` — Liste utilisateurs
- `/admin/parametres` — Horaires, ouverture/fermeture, frais livraison, message d'accueil

### API (route handlers)
- `/api/cart/*`, `/api/orders/*`, `/api/checkout/session`, `/api/webhooks/stripe`
- `/api/orders/[id]/status` (admin)
- Tout protégé par auth + RBAC

---

## 🎨 Direction artistique

- **Style** : street-food premium, brut, gourmand. Inspirations : Big Fernand, Five Guys, Blend, mais en plus moderne (genre awwwards / linear-grade).
- **Palette dark mode (default)** :
  - `--bg`: #0B0B0B
  - `--surface`: #141414
  - `--accent`: #FF4D2E (orange braise)
  - `--accent-2`: #F5C518 (jaune moutarde)
  - `--text`: #FAFAFA
  - `--muted`: #9A9A9A
  - `--success`: #22C55E
- **Mode light** disponible avec toggle.
- **Typo** : "Bricolage Grotesque" (titres display) + "Inter" (UI/corps), via next/font.
- **Vibes** : grain léger, gros titres, micro-interactions (image scale + tilt 3D), parallax doux, sections plein écran, transitions de page fluides.

---

## 🍔 Données du menu (à seeder via `prisma/seed.ts`)

Les images sont à télécharger AVANT le seed (voir script plus bas) et stockées dans `public/menu/`. Le champ `image` doit pointer vers `/menu/<filename>`.

```ts
// extrait — implémente la totalité
const CATEGORIES = ["Entrées","Salades","Burgers frites","Fish burger","Sandwichs frites","Menu Enfant","Boissons","Desserts","Pasta","Sauces"];

const PRODUCTS = [
  // Entrées
  { cat:"Entrées", slug:"ailes-bbq-6", name:'Ailes de Poulet BBQ "6 Pièces"', price:12, img:"ailes-Poulet-BBQ.jpg" },
  { cat:"Entrées", slug:"ailes-bbq-12", name:'Ailes de Poulet BBQ "12 Pièces"', price:20, img:"ailes-Poulet-BBQ.jpg" },
  { cat:"Entrées", slug:"frites", name:"Frites Maison", price:5, img:"frites.jpg" },
  { cat:"Entrées", slug:"hot-dog", name:"Hot Dog", price:14, img:"hot-dog.jpg" },
  { cat:"Entrées", slug:"houmous", name:"Houmous maison – viande au choix en supplément", price:10, img:null },
  { cat:"Entrées", slug:"nachos", name:"Nachos guacamole", price:9, img:"nachos-guacamole.jpg" },
  { cat:"Entrées", slug:"onion-rings-grand", name:"Oignon Rings maison Grand", price:15, img:"oignon-rings.jpg" },
  { cat:"Entrées", slug:"onion-rings-petit", name:"Oignon Rings maison Petit", price:8, img:"oignon-rings.jpg" },
  { cat:"Entrées", slug:"tenders-5", name:'Tenders "5 pièces"', price:12, img:"Tenders-5pcs.jpg" },
  { cat:"Entrées", slug:"tenders-10", name:'Tenders "10 Pièces"', price:20, img:"Tenders-10pcs.jpg" },

  // Salades
  { cat:"Salades", slug:"salade-entrecote", name:"Salade Entrecôte", price:20, img:"salade-entrecote.jpg" },
  { cat:"Salades", slug:"salade-parguit", name:"Salade Parguit", price:18, img:"salade-parguit.jpg" },
  { cat:"Salades", slug:"salade-poulet-pane", name:"Salade Poulet Pané", price:16, img:"salade-poulet-pane.jpg" },

  // Burgers frites
  { cat:"Burgers frites", slug:"burger-classique", name:"Burger Classique", price:16, img:"burger-classique.jpg",
    options:[{name:"Sauces au choix", type:"MULTI", maxChoices:2, required:true, choices:["BBQ","Darka","Ketchup","Mayo","Moutarde américaine","Moutarde miel","Pesto","Piment","Tartare"]}] },
  { cat:"Burgers frites", slug:"burger-foie-gras", name:"Burger Foie Gras", price:26, img:"burger-classique.jpg" },
  { cat:"Burgers frites", slug:"chicken-burger", name:"Chicken Burger", price:16, img:"chicken-burger.jpg" },
  { cat:"Burgers frites", slug:"smash-burger", name:"Smash Burger", price:16, img:"smash-burger.jpg",
    description:"1 steak smashé, 1 fromage, garniture et 2 sauces au choix. Servi avec frites et 2 sauces pour frites au choix." },
  { cat:"Burgers frites", slug:"double-smash", name:"Double Smash Burger", price:19, img:"smash-burger.jpg" },
  { cat:"Burgers frites", slug:"triple-smash", name:"Triple Smash Burger", price:22, img:"smash-burger.jpg" },

  // Fish
  { cat:"Fish burger", slug:"fish-burger", name:"Fish burger", price:14, img:"fish-burger.jpg" },
  { cat:"Fish burger", slug:"double-fish", name:"Double Fish burger", price:18, img:"fish-burger.jpg" },

  // Sandwichs
  { cat:"Sandwichs frites", slug:"sand-entrecote", name:"Sandwich Entrecôte", price:22, img:"sand-entrecot.jpg" },
  { cat:"Sandwichs frites", slug:"sand-merguez", name:"Sandwich merguez", price:21, img:null },
  { cat:"Sandwichs frites", slug:"sand-parguit", name:"Sandwich Parguit", price:19, img:"sand-parguit.jpg" },
  { cat:"Sandwichs frites", slug:"sand-poulet-pane", name:"Sandwich Poulet Pané", price:17, img:"sand-poul-pan.jpg" },
  { cat:"Sandwichs frites", slug:"sand-viande-hachee", name:"Sandwich Viande Hachée Marinée", price:19, img:"sand-viand-hach.jpg" },

  // Menu enfant
  { cat:"Menu Enfant", slug:"menu-enfant", name:"Menu Enfant", price:13, img:null },

  // Boissons
  { cat:"Boissons", slug:"coca", name:"Coca Cola 33cl", price:2, img:"DSC04708.jpg" },
  { cat:"Boissons", slug:"coca-zero", name:"Coca Cola Zero 33cl", price:2, img:"DSC04712.jpg" },
  { cat:"Boissons", slug:"cristaline", name:"Cristaline 50cl", price:1.5, img:"DSC04716.jpg" },
  { cat:"Boissons", slug:"ice-tea", name:"Ice Tea", price:2, img:"DSC04710.jpg" },
  { cat:"Boissons", slug:"oasis", name:"Oasis Tropical", price:2, img:"DSC04715.jpg" },

  // Desserts
  { cat:"Desserts", slug:"fondant", name:"Fondant au chocolat", price:5, img:"fondant-choc.jpg" },
  { cat:"Desserts", slug:"smash-nutella", name:"Smash nutella banane", price:6.5, img:"smash-nutella-banane.jpg" },

  // Pasta
  { cat:"Pasta", slug:"spaghetti", name:"Spaghetti sauce tomate viande au choix", price:13, img:null },

  // Sauces
  { cat:"Sauces", slug:"sauce-bbq", name:"BBQ", price:0.5, img:"sauce-bbq.jpg" },
  { cat:"Sauces", slug:"sauce-darka", name:"Darka", price:0.5, img:"sauce-darka.jpg" },
  { cat:"Sauces", slug:"sauce-ketchup", name:"Ketchup", price:0.5, img:"sauce-ketchup.jpg" },
  { cat:"Sauces", slug:"sauce-mayo", name:"Mayonnaise", price:0.5, img:"sauce-mayo.jpg" },
  { cat:"Sauces", slug:"sauce-moutarde-am", name:"Moutarde américaine", price:0.5, img:"sauce-moutarde-miel.jpg" },
  { cat:"Sauces", slug:"sauce-moutarde-miel", name:"Moutarde au miel", price:0.5, img:"sauce-moutarde-miel.jpg" },
  { cat:"Sauces", slug:"sauce-pesto", name:"Pesto", price:0.5, img:"sauce-pesto.jpg" },
  { cat:"Sauces", slug:"sauce-piment", name:"Piment", price:0.5, img:"sauce-piment.jpg" },
  { cat:"Sauces", slug:"sauce-tartare", name:"Tartare", price:0.5, img:"sauce-tartare.jpg" },
];
```

---

## 📦 Récupération des images (à lancer EN PREMIER)

```bash
mkdir -p public/menu public/brand
BASE="https://ladarka.fr/wp-content/uploads/2026/02"
FILES=(
  "ailes-Poulet-BBQ.jpg" "frites.jpg" "hot-dog.jpg" "nachos-guacamole.jpg"
  "oignon-rings.jpg" "Tenders-5pcs.jpg" "Tenders-10pcs.jpg"
  "salade-entrecote.jpg" "salade-parguit.jpg" "salade-poulet-pane.jpg"
  "burger-classique.jpg" "chicken-burger.jpg" "smash-burger.jpg" "fish-burger.jpg"
  "sand-entrecot.jpg" "sand-parguit.jpg" "sand-poul-pan.jpg" "sand-viand-hach.jpg"
  "DSC04708.jpg" "DSC04712.jpg" "DSC04716.jpg" "DSC04710.jpg" "DSC04715.jpg"
  "fondant-choc.jpg" "smash-nutella-banane.jpg"
  "sauce-bbq.jpg" "sauce-darka.jpg" "sauce-ketchup.jpg" "sauce-mayo.jpg"
  "sauce-moutarde-miel.jpg" "sauce-pesto.jpg" "sauce-piment.jpg" "sauce-tartare.jpg"
  "1200x400-02-2026.png"
)
for f in "${FILES[@]}"; do
  curl -sSL "$BASE/$f" -o "public/menu/$f" && echo "✓ $f"
done
curl -sSL "https://ladarka.fr/wp-content/uploads/2025/09/2025-09-09-a-18.59.25_0657ee32.gif" \
  -o "public/brand/logo.gif" && echo "✓ logo"
```

> Ces images appartiennent à La Darka. Usage strictement pour la maquette/proposition client.

---

## 🔐 Variables d'environnement (`.env.example`)

```
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
NEXT_PUBLIC_SITE_URL=
RESTAURANT_PHONE=
RESTAURANT_ADDRESS=
```

---

## ✅ Critères de qualité (non négociables)

- **Lighthouse ≥ 95** sur toutes les pages publiques
- **CLS = 0**, LCP < 2s
- **Responsive parfait** mobile-first (375 / 768 / 1440)
- **PWA installable** (manifest + service worker basique)
- **Accessibilité AA** : nav clavier complète, focus visibles, alt sur toutes les images
- **SEO** : metadata + OG + JSON-LD `Restaurant` + `Menu` + sitemap dynamique
- **Sécurité** :
  - Webhooks Stripe vérifiés par signature
  - Server Actions et API routes protégées par middleware auth + Zod
  - Rate limiting sur login/register/checkout (Upstash)
  - CSRF géré par Better-Auth
  - RLS Supabase activée
  - Pas de prix calculés côté client (toujours recalculer côté serveur avant Stripe Checkout)
- **Tests** : Vitest pour la logique panier/total, Playwright pour le parcours commande complet
- **Code** : TypeScript strict, ESLint, Prettier, pas de `any`, composants découpés, server components par défaut, client uniquement quand nécessaire

---

## 🚀 Livrables attendus

1. Repo Next.js complet, `pnpm install && pnpm db:push && pnpm db:seed && pnpm dev` qui fonctionne
2. Toutes les images dans `/public/menu/`
3. Schéma Prisma + migrations + seed exécuté
4. Stripe en mode test fonctionnel de bout en bout (commande → paiement → webhook → statut → email)
5. Suivi de commande temps réel opérationnel (changer le statut côté admin met à jour la page client sans refresh)
6. Compte client : inscription, login, historique, recommander
7. Dashboard admin minimal mais fonctionnel (kanban des commandes)
8. Emails transactionnels stylés (React Email)
9. README clair : setup local, déploiement Vercel, configuration Stripe webhook, création premier admin
10. Liste de TODO/améliorations en fin de README (PWA push notifications, fidélité, codes promo, multi-langue FR/HE, etc.)

---

## 🧠 Avant de commencer

1. Pose-moi 3 à 5 questions critiques (ex : adresse exacte, zone de livraison, mode pickup uniquement ou les deux, langue HE nécessaire dès la v1, intégration caisse existante).
2. Propose 2 directions visuelles différentes en quelques lignes (ex : "moderne épuré sombre" vs "fun street-art coloré").
3. Une fois validé, **GO** : commence par le setup (Next + Prisma + Auth + Stripe), puis le seed avec les images téléchargées, puis le front, puis l'admin. Ne me redemande pas confirmation à chaque fichier.

Fais-moi un truc qui claque. 🔥