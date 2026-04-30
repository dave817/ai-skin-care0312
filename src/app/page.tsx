import { listProducts } from "@/lib/db/products-repo";
import { listBlogs } from "@/lib/db/blogs-repo";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, blogs] = await Promise.all([listProducts(), listBlogs()]);

  /* Top products: bestsellers first, then by stock; cap to 8 */
  const topProducts = products
    .filter((p) => p.active)
    .sort((a, b) => {
      const aScore = a.tags.includes("bestseller") ? 2 : a.tags.includes("featured") ? 1 : 0;
      const bScore = b.tags.includes("bestseller") ? 2 : b.tags.includes("featured") ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, 8);

  /* New products: tagged "new", up to 8 */
  const newProducts = products
    .filter((p) => p.active && p.tags.includes("new"))
    .slice(0, 8);

  /* Latest 3 blogs */
  const latestBlogs = blogs.slice(0, 3);

  return (
    <HomeClient
      topProducts={topProducts}
      newProducts={newProducts}
      latestBlogs={latestBlogs}
    />
  );
}
