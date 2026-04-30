import Link from "next/link";
import { getBlogBySlug } from "@/lib/db/blogs-repo";
import { getProduct } from "@/lib/db/products-repo";
import type { Product } from "@/data/products";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-secondary text-lg">找不到此文章</p>
        <Link href="/blog" className="btn-primary">
          返回網誌
        </Link>
      </div>
    );
  }

  /* Resolve related products */
  const resolved = await Promise.all(
    blog.relatedProductIds.map((id) => getProduct(id))
  );
  const relatedProducts: Product[] = resolved.filter(
    (p): p is NonNullable<typeof p> => p !== null && p.active
  );

  return <BlogDetailClient blog={blog} relatedProducts={relatedProducts} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "找不到文章 | Dear Glow Beauty" };
  return {
    title: `${blog.title} | Dear Glow Beauty`,
    description: blog.excerpt,
    openGraph: { images: [blog.coverImage] },
  };
}
