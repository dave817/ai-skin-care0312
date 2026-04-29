import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug 只可包含小寫英文、數字、連字號"),
  brand: z.string().min(1),
  nameZh: z.string().min(1),
  nameEn: z.string().default(""),
  category: z.string().min(1),
  subcategory: z.string().default(""),
  priceOriginal: z.number().int().nonnegative(),
  priceSale: z.number().int().nonnegative().nullable(),
  currency: z.string().default("HKD"),
  descriptionZh: z.string().default(""),
  imageUrl: z.string().url(),
  imageAlt: z.string().default(""),
  tags: z.array(z.string()).default([]),
  skinConcerns: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  volume: z.string().default(""),
  stock: z.number().int().nonnegative(),
  active: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
