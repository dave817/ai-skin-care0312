import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db/products-repo";
import ProductForm from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">編輯產品</h1>
        <p className="text-text-muted text-sm mt-1 font-mono">{product.id}</p>
      </div>
      <ProductForm initial={product} isEdit />
    </div>
  );
}
