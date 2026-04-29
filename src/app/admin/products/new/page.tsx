import ProductForm from "@/components/admin/ProductForm";

export default function AdminNewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">新增產品</h1>
        <p className="text-text-muted text-sm mt-1">填入產品資料後儲存</p>
      </div>
      <ProductForm />
    </div>
  );
}
