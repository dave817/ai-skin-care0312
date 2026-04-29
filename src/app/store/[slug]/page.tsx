import Link from "next/link";
import { listProducts } from "@/lib/db/products-repo";
import type { Product } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  /* Single Redis read; derive both target product and related list from it */
  const all = await listProducts();
  const product = all.find((p) => p.slug === slug && p.active);

  if (!product) {
    return (
      <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted text-lg">找不到此商品</p>
        <Link href="/store" className="text-accent-blue text-sm hover:underline">
          返回商品目錄
        </Link>
      </main>
    );
  }

  const relatedProducts: Product[] = all
    .filter(
      (p) => p.active && p.category === product.category && p.id !== product.id
    )
    .slice(0, 8);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const all = await listProducts();
  const product = all.find((p) => p.slug === slug);
  if (!product) return { title: "找不到商品 | Dear Glow Beauty" };
  return {
    title: `${product.brand} ${product.nameZh} | Dear Glow Beauty`,
    description: product.descriptionZh.slice(0, 160).replace(/<[^>]+>/g, ""),
    openGraph: { images: [product.imageUrl] },
  };
}
