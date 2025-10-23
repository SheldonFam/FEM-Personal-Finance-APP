import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({
  title,
  href,
  linkText = "See Details",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2"
        >
          {linkText}
          <svg width="6" height="11" viewBox="0 0 6 11" fill="currentColor">
            <path
              d="M0.5 0.5L5 5.5L0.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
