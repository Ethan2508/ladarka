export type OptionType = "SINGLE" | "MULTI";

export type ProductOption = {
  name: string;
  type: OptionType;
  required?: boolean;
  maxChoices?: number;
  choices: { label: string; priceModifier?: number }[];
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  description?: string;
  badge?: "best" | "new" | "spicy";
  options?: ProductOption[];
};

export const CATEGORIES = [
  { slug: "entrees", name: "Entrées", emoji: "🌶️" },
  { slug: "salades", name: "Salades", emoji: "🥗" },
  { slug: "burgers", name: "Burgers frites", emoji: "🍔" },
  { slug: "fish", name: "Fish burger", emoji: "🐟" },
  { slug: "sandwichs", name: "Sandwichs frites", emoji: "🥖" },
  { slug: "enfant", name: "Menu Enfant", emoji: "🧒" },
  { slug: "boissons", name: "Boissons", emoji: "🥤" },
  { slug: "desserts", name: "Desserts", emoji: "🍫" },
  { slug: "pasta", name: "Pasta", emoji: "🍝" },
  { slug: "sauces", name: "Sauces", emoji: "🥫" },
] as const;

const SAUCES = [
  "BBQ",
  "Darka",
  "Ketchup",
  "Mayo",
  "Moutarde américaine",
  "Moutarde miel",
  "Pesto",
  "Piment",
  "Tartare",
];

const SAUCE_OPTION: ProductOption = {
  name: "Sauces au choix (2 max)",
  type: "MULTI",
  required: true,
  maxChoices: 2,
  choices: SAUCES.map((label) => ({ label })),
};

const FRIES_SAUCE_OPTION: ProductOption = {
  name: "Sauces pour frites (2 max)",
  type: "MULTI",
  required: false,
  maxChoices: 2,
  choices: SAUCES.map((label) => ({ label })),
};

const BURGER_DESC =
  "Steak frais smashé sur la plaque, fromage fondu, garniture maison. Servi avec frites cuites en deux temps.";

export const PRODUCTS: Product[] = [
  // Entrées
  { category: "entrees", slug: "ailes-bbq-6", name: 'Ailes de Poulet BBQ "6 Pièces"', price: 12, image: "/menu/ailes-Poulet-BBQ.jpg", description: "6 ailes marinées 24h, glaze BBQ maison, finition au four." },
  { category: "entrees", slug: "ailes-bbq-12", name: 'Ailes de Poulet BBQ "12 Pièces"', price: 20, image: "/menu/ailes-Poulet-BBQ.jpg", description: "12 ailes marinées 24h, glaze BBQ maison, finition au four.", badge: "best" },
  { category: "entrees", slug: "frites", name: "Frites Maison", price: 5, image: "/menu/frites.jpg", description: "Pommes fraîches, double cuisson, fleur de sel.", options: [FRIES_SAUCE_OPTION] },
  { category: "entrees", slug: "hot-dog", name: "Hot Dog", price: 14, image: "/menu/hot-dog.jpg", description: "Saucisse premium, oignons confits, moutarde américaine, ketchup maison." },
  { category: "entrees", slug: "houmous", name: "Houmous Maison", price: 10, image: null, description: "Pois chiches, tahin, citron, huile d'olive. Viande au choix en supplément." },
  { category: "entrees", slug: "nachos", name: "Nachos Guacamole", price: 9, image: "/menu/nachos-guacamole.jpg", description: "Tortilla chips, guacamole frais, cheddar fondu, jalapeños." },
  { category: "entrees", slug: "onion-rings-grand", name: "Onion Rings Maison — Grand", price: 15, image: "/menu/oignon-rings.jpg" },
  { category: "entrees", slug: "onion-rings-petit", name: "Onion Rings Maison — Petit", price: 8, image: "/menu/oignon-rings.jpg" },
  { category: "entrees", slug: "tenders-5", name: 'Tenders "5 Pièces"', price: 12, image: "/menu/Tenders-5pcs.jpg", description: "Aiguillettes de poulet panées, panure croustillante." },
  { category: "entrees", slug: "tenders-10", name: 'Tenders "10 Pièces"', price: 20, image: "/menu/Tenders-10pcs.jpg" },

  // Salades
  { category: "salades", slug: "salade-entrecote", name: "Salade Entrecôte", price: 20, image: "/menu/salade-entrecote.jpg", description: "Mesclun, tomates cerises, oignons rouges, entrecôte saisie, vinaigrette balsamique." },
  { category: "salades", slug: "salade-parguit", name: "Salade Parguit", price: 18, image: "/menu/salade-parguit.jpg", description: "Cuisses de poulet désossées grillées, salade fraîche, sauce maison." },
  { category: "salades", slug: "salade-poulet-pane", name: "Salade Poulet Pané", price: 16, image: "/menu/salade-poulet-pane.jpg" },

  // Burgers
  { category: "burgers", slug: "burger-classique", name: "Burger Classique", price: 16, image: "/menu/burger-classique.jpg", description: BURGER_DESC, options: [SAUCE_OPTION, FRIES_SAUCE_OPTION] },
  { category: "burgers", slug: "burger-foie-gras", name: "Burger Foie Gras", price: 26, image: "/menu/burger-classique.jpg", description: "Steak premium, foie gras poêlé, oignons confits, pain brioché.", badge: "new", options: [FRIES_SAUCE_OPTION] },
  { category: "burgers", slug: "chicken-burger", name: "Chicken Burger", price: 16, image: "/menu/chicken-burger.jpg", description: "Filet de poulet pané croustillant, sauce darka, salade, pickles.", options: [SAUCE_OPTION, FRIES_SAUCE_OPTION] },
  { category: "burgers", slug: "smash-burger", name: "Smash Burger", price: 16, image: "/menu/smash-burger.jpg", description: "1 steak smashé, fromage fondant, sauce maison, frites.", badge: "best", options: [SAUCE_OPTION, FRIES_SAUCE_OPTION] },
  { category: "burgers", slug: "double-smash", name: "Double Smash Burger", price: 19, image: "/menu/smash-burger.jpg", description: "2 steaks smashés, double fromage, sauce maison.", options: [SAUCE_OPTION, FRIES_SAUCE_OPTION] },
  { category: "burgers", slug: "triple-smash", name: "Triple Smash Burger", price: 22, image: "/menu/smash-burger.jpg", description: "Triple dose. Pour les vrais.", badge: "spicy", options: [SAUCE_OPTION, FRIES_SAUCE_OPTION] },

  // Fish
  { category: "fish", slug: "fish-burger", name: "Fish Burger", price: 14, image: "/menu/fish-burger.jpg", description: "Filet de poisson pané, cheddar, sauce tartare, salade.", options: [FRIES_SAUCE_OPTION] },
  { category: "fish", slug: "double-fish", name: "Double Fish Burger", price: 18, image: "/menu/fish-burger.jpg", options: [FRIES_SAUCE_OPTION] },

  // Sandwichs
  { category: "sandwichs", slug: "sand-entrecote", name: "Sandwich Entrecôte", price: 22, image: "/menu/sand-entrecot.jpg", description: "Pain ciabatta, entrecôte, oignons, roquette." },
  { category: "sandwichs", slug: "sand-merguez", name: "Sandwich Merguez", price: 21, image: null },
  { category: "sandwichs", slug: "sand-parguit", name: "Sandwich Parguit", price: 19, image: "/menu/sand-parguit.jpg" },
  { category: "sandwichs", slug: "sand-poulet-pane", name: "Sandwich Poulet Pané", price: 17, image: "/menu/sand-poul-pan.jpg" },
  { category: "sandwichs", slug: "sand-viande-hachee", name: "Sandwich Viande Hachée Marinée", price: 19, image: "/menu/sand-viand-hach.jpg" },

  // Enfant
  { category: "enfant", slug: "menu-enfant", name: "Menu Enfant", price: 13, image: null, description: "Tenders ou mini burger + frites + boisson + dessert." },

  // Boissons
  { category: "boissons", slug: "coca", name: "Coca-Cola 33cl", price: 2, image: "/menu/DSC04708.jpg" },
  { category: "boissons", slug: "coca-zero", name: "Coca-Cola Zero 33cl", price: 2, image: "/menu/DSC04712.jpg" },
  { category: "boissons", slug: "cristaline", name: "Cristaline 50cl", price: 1.5, image: "/menu/DSC04716.jpg" },
  { category: "boissons", slug: "ice-tea", name: "Ice Tea", price: 2, image: "/menu/DSC04710.jpg" },
  { category: "boissons", slug: "oasis", name: "Oasis Tropical", price: 2, image: "/menu/DSC04715.jpg" },

  // Desserts
  { category: "desserts", slug: "fondant", name: "Fondant au Chocolat", price: 5, image: "/menu/fondant-choc.jpg", description: "Cœur coulant, chocolat noir 70%." },
  { category: "desserts", slug: "smash-nutella", name: "Smash Nutella Banane", price: 6.5, image: "/menu/smash-nutella-banane.jpg", badge: "best" },

  // Pasta
  { category: "pasta", slug: "spaghetti", name: "Spaghetti Sauce Tomate", price: 13, image: null, description: "Pâtes fraîches, sauce tomate maison. Viande au choix en supplément." },

  // Sauces
  { category: "sauces", slug: "sauce-bbq", name: "BBQ", price: 0.5, image: "/menu/sauce-bbq.jpg" },
  { category: "sauces", slug: "sauce-darka", name: "Darka", price: 0.5, image: "/menu/sauce-darka.jpg" },
  { category: "sauces", slug: "sauce-ketchup", name: "Ketchup", price: 0.5, image: "/menu/sauce-ketchup.jpg" },
  { category: "sauces", slug: "sauce-mayo", name: "Mayonnaise", price: 0.5, image: "/menu/sauce-mayo.jpg" },
  { category: "sauces", slug: "sauce-moutarde-am", name: "Moutarde Américaine", price: 0.5, image: "/menu/sauce-moutarde-miel.jpg" },
  { category: "sauces", slug: "sauce-moutarde-miel", name: "Moutarde Miel", price: 0.5, image: "/menu/sauce-moutarde-miel.jpg" },
  { category: "sauces", slug: "sauce-pesto", name: "Pesto", price: 0.5, image: "/menu/sauce-pesto.jpg" },
  { category: "sauces", slug: "sauce-piment", name: "Piment", price: 0.5, image: "/menu/sauce-piment.jpg" },
  { category: "sauces", slug: "sauce-tartare", name: "Tartare", price: 0.5, image: "/menu/sauce-tartare.jpg" },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function bestsellers(): Product[] {
  return PRODUCTS.filter((p) => p.badge === "best");
}
