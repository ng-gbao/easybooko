import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

const AMENITY_LABELS: Record<string, { compact: string; full: string }> = {
  air_conditioner: { compact: "AC", full: "Air Conditioner" },
  wifi: { compact: "WiFi", full: "WiFi" },
  parking: { compact: "Parking", full: "Parking" },
  breakfast: { compact: "Breakfast", full: "Breakfast" },
  pool: { compact: "Pool", full: "Swimming Pool" },
};

export function formatPrice(value: number | string | undefined | null): string {
  if (value == null) return "0đ";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0đ";
  const formatted = Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formatted + "đ";
}

export function formatAmenity(key: string, variant: "compact" | "full" = "full"): string {
  const label = AMENITY_LABELS[key]?.[variant];
  if (label) return label;
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
