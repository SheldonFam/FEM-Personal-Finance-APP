"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/Avatar";
import { normalizeImagePath } from "@/lib/utils";

/**
 * Up to two initials from a name. "Spark Electric Solutions" gives SE,
 * "Netflix" gives N. Falls back to a dash rather than rendering an empty
 * circle if a name is somehow blank.
 */
function initialsOf(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return letters.toUpperCase() || "–";
}

interface TransactionAvatarProps {
  /** May be empty. A CSV-imported transaction has no image of its own. */
  src: string;
  /** The merchant or person. Used for the initials, and to name the image. */
  name: string;
  /** Rendered size in pixels. The lists use 40; the budget card uses 32. */
  size?: 32 | 40;
  className?: string;
}

/**
 * The circular avatar beside a transaction or bill.
 *
 * Four components rendered their own version of this. They now share one, on
 * top of the Avatar primitive that was already in the repo and imported
 * nowhere.
 *
 * The point of using it is AvatarFallback: it renders when the image is absent
 * or fails to load, so a transaction without one shows its initials rather
 * than a broken image. That is what let the CSV import stop stamping one
 * specific company's logo onto every row it created.
 *
 * Note this gives up next/image for avatars -- Radix renders a plain img.
 * Deliberate: these are ~40px files already served from public/, and automatic
 * fallback everywhere is worth more than optimising them. The dimensions and
 * lazy loading below are set by hand for the same reason next/image would.
 */
export function TransactionAvatar({
  src,
  name,
  size = 40,
  className = "",
}: TransactionAvatarProps) {
  const dimension = size === 32 ? "size-8" : "size-10";

  return (
    <Avatar className={`${dimension} flex-shrink-0 bg-gray-100 ${className}`}>
      {src ? (
        <AvatarImage
          src={normalizeImagePath(src)}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          className="object-cover"
        />
      ) : null}
      <AvatarFallback className="text-xs font-medium text-gray-600">
        {initialsOf(name)}
      </AvatarFallback>
    </Avatar>
  );
}
