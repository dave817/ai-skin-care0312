import { listProducts } from "@/lib/db/products-repo";
import type { Product } from "@/data/products";

interface CatalogEntry {
  id: string;
  brand: string;
  nameZh: string;
  category: string;
  subcategory: string;
  skinConcerns: string[];
  priceSale: number | null;
  priceOriginal: number;
}

interface CachedCatalog {
  catalog: CatalogEntry[];
  promptString: string;
  validIds: Set<string>;
  productMap: Map<string, Product>;
  fetchedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
let cached: CachedCatalog | null = null;

async function build(): Promise<CachedCatalog> {
  const products = await listProducts();
  const active = products.filter((p) => p.active !== false);

  const catalog: CatalogEntry[] = active.map((p) => ({
    id: p.id,
    brand: p.brand,
    nameZh: p.nameZh,
    category: p.category,
    subcategory: p.subcategory,
    skinConcerns: p.skinConcerns ?? [],
    priceSale: p.priceSale ?? null,
    priceOriginal: p.priceOriginal,
  }));

  const promptString = catalog
    .map(
      (c) =>
        `${c.id} | ${c.brand} ${c.nameZh} | ${c.category}/${c.subcategory} | concerns:[${c.skinConcerns.join(",")}] | HK$${c.priceSale ?? c.priceOriginal}`
    )
    .join("\n");

  const validIds = new Set(catalog.map((c) => c.id));
  const productMap = new Map<string, Product>();
  for (const p of active) productMap.set(p.id, p);

  return { catalog, promptString, validIds, productMap, fetchedAt: Date.now() };
}

export async function getProductCatalog(): Promise<CachedCatalog> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached;
  cached = await build();
  return cached;
}

export async function filterValidProductIds(ids: unknown): Promise<string[]> {
  if (!Array.isArray(ids)) return [];
  const { validIds } = await getProductCatalog();
  return ids.filter((id): id is string => typeof id === "string" && validIds.has(id));
}

export function invalidateCatalogCache(): void {
  cached = null;
}
