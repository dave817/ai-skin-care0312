import { listProducts } from "@/lib/db/products-repo";
import StoreClient from "./StoreClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "商品目錄 | Dear Glow Beauty",
  description:
    "瀏覽 Dear Glow Beauty 全部韓國美妝產品 — 護膚、彩妝、頭髮護理、美容工具，正貨直送香港。",
};

export default async function StorePage() {
  const allProducts = await listProducts();
  return <StoreClient allProducts={allProducts} />;
}
