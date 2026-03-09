import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `HK$${price.toLocaleString()}`;
}

export function calcDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}
