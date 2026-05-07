import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/lib/menu";
import { ProductDetail } from "@/components/product-detail";
import type { Metadata } from "next";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Introuvable" };
  return {
    title: p.name,
    description: p.description ?? `${p.name} — La Darka, Lyon.`,
    openGraph: {
      title: p.name,
      description: p.description ?? "",
      images: p.image ? [p.image] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
