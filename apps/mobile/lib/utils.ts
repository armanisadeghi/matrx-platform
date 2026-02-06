import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict resolution.
 *
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution)
 * so the last-specified utility always wins. This enables component consumers
 * to override default styles without fighting specificity.
 *
 * @example
 * cn("px-4 py-2", isLarge && "px-6 py-3")       // conditional
 * cn("bg-primary", className)                     // consumer override
 * cn("text-sm text-base")                         // "text-base" wins
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
