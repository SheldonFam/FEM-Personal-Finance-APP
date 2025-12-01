import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers: number[] = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    // Always show first page
    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push(-1); // Ellipsis
    }

    // Show current page and neighbors
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(-2); // Ellipsis
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
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

      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page < 0) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                w-10 h-10 rounded-md text-sm font-medium transition-colors cursor-pointer 
                flex items-center justify-center
                ${
                  isActive
                    ? "bg-[#282828] text-[#E0E0E0]"
                    : "bg-[#F8F8F8] text-[#404040] border border-[#D0D0D0] hover:bg-[#F0F0F0]"
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
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
