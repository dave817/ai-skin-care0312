import { z } from "zod";

export const blogSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug 只可包含小寫英文、數字、連字號"),
  title: z.string().min(1),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  coverImage: z.string().url(),
  date: z.string().min(1),
  author: z.string().default("Dear Glow Beauty"),
  tags: z.array(z.string()).default([]),
  relatedProductIds: z.array(z.string()).default([]),
});

export type BlogInput = z.infer<typeof blogSchema>;
