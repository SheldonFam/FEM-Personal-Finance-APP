import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize image paths for Next.js Image component
 * Converts relative paths (./assets/...) to absolute paths (/assets/...)
 */
export function normalizeImagePath(path: string): string {
  if (path.startsWith("./")) {
    return path.replace("./", "/");
  }
  return path;
}
