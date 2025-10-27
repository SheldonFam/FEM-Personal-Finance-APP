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
      <h2 className="text-xl font-bold text-[#201F24]">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-[#696868] hover:text-[#201F24] flex items-center gap-3 transition-colors"
        >
          {linkText}
          <svg width="6" height="11" viewBox="0 0 6 11" fill="none">
            <path
              d="M1 1L5 5.5L1 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
