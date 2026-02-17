import Link from "next/link";
import Image from "next/image";

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
      <h2 className="text-xl font-bold text-finance-navy">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-finance-grey hover:text-finance-navy flex items-center gap-3 transition-colors"
        >
          {linkText}
          <Image
            src="/assets/images/icon-caret-right.svg"
            alt=""
            width={6}
            height={11}
          />
        </Link>
      )}
    </div>
  );
}
