import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "...";

const getMobilePages = (
  currentPage: number,
  totalPages: number
): PageItem[] => {
  const pages: PageItem[] = [];

  // If 3 or fewer pages, show all
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always show first page
  pages.push(1);

  // If current page is near the start (1-2)
  if (currentPage <= 2) {
    pages.push(2);
    pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  // If current page is near the end (last or last-1)
  if (currentPage >= totalPages - 1) {
    pages.push("...");
    pages.push(totalPages - 1);
    pages.push(totalPages);
    return pages;
  }

  // Current page is in the middle - show: 1, current, ..., last
  pages.push(currentPage);
  pages.push("...");
  pages.push(totalPages);

  return pages;
};

const getDesktopPages = (
  currentPage: number,
  totalPages: number
): PageItem[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PageItem[] = [];

  // Always show first page
  pages.push(1);

  if (currentPage <= 3) {
    // Near start: 1 2 3 4 ... last
    for (let i = 2; i <= 4; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    // Near end: 1 ... (last-3) (last-2) (last-1) last
    pages.push("...");
    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
  } else {
    // Middle: 1 ... (cur-1) cur (cur+1) ... last
    pages.push("...");
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const mobilePages = getMobilePages(currentPage, totalPages);
  const desktopPages = getDesktopPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
      {/* Prev Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-full px-4 py-[9.5px] gap-4"
      >
        <Image
          src="/assets/images/icon-caret-left.svg"
          alt="Previous"
          width={6}
          height={6}
        />
        <p className="hidden md:block text-sm leading-[150%]">Prev</p>
      </Button>

      {/* Mobile pagination */}
      <div className="flex items-center gap-2 md:hidden">
        {mobilePages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`m-ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <Button
              key={`m-${page}`}
              onClick={() => changePage(page)}
              variant="ghost"
              className={`
                w-10 h-10 rounded-md text-sm font-medium transition-colors 
                flex items-center justify-center hover:bg-transparent
                ${
                  isActive
                    ? "bg-[#201F24] text-[#FFFFFF] hover:bg-[#201F24]"
                    : "bg-transparent text-[#201F24] border border-[#98908B] hover:bg-[#F0F0F0]"
                }
              `}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Desktop pagination */}
      <div className="hidden md:flex items-center gap-2">
        {desktopPages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`d-ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <Button
              key={`d-${page}`}
              onClick={() => changePage(page)}
              variant="ghost"
              className={`
                w-10 h-10 rounded-md text-sm font-medium transition-colors 
                flex items-center justify-center hover:bg-transparent
                ${
                  isActive
                    ? "bg-[#201F24] text-[#FFFFFF] hover:bg-[#201F24]"
                    : "bg-transparent text-[#201F24] border border-[#98908B] hover:bg-[#F0F0F0]"
                }
              `}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-full px-4 py-[9.5px] gap-4"
      >
        <p className="hidden md:block text-sm leading-[150%]">Next</p>
        <Image
          src="/assets/images/icon-caret-right.svg"
          alt="Next"
          width={6}
          height={6}
        />
      </Button>
    </div>
  );
};
