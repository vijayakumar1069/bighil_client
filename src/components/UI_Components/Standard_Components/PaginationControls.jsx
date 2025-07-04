"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronsLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaginationControls({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}) {
  const generatePaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    // Adjust start if we're near the end
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    // Always show first page
    if (start > 1) {
      range.push(1);
      if (start > 2) range.push("...");
    }

    // Generate middle range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Always show last page
    if (end < totalPages) {
      if (end < totalPages - 1) range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* First Page Button */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1 px-2.5 border-pagination_border bg-white/10",
            !hasPreviousPage && "opacity-50 pointer-events-none"
          )}
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
        >
          <ChevronsLeftRight className="w-4 h-4 -mr-1" />
          <span className="max-sm:hidden text-text_color">First</span>
        </Button>

        {/* Previous Page Button */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 border-pagination_border ",
            !hasPreviousPage && "opacity-50 pointer-events-none"
          )}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          <ChevronLeft className="w-4 h-4 text-text_color" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5">
          {generatePaginationRange().map((page, index) =>
            page === "..." ? (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 "
                disabled
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </Button>
            ) : (
              <Button
                key={page}
                // variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 min-w-8 px-2 hidden sm:inline-flex hover:text-white bg-white/10 border-pagination_border",
                  page === currentPage &&
                    "font-light bg-primary text-white opacity-100"
                )}
                onClick={() => typeof page === "number" && onPageChange(page)}
                // disabled={page === currentPage}
              >
                {page}
              </Button>
            )
          )}
        </div>

        {/* Next Page Button */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 border-pagination_border hover:text-white hover:bg-primary",
            !hasNextPage && "opacity-50 pointer-events-none"
          )}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last Page Button */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1 px-2.5 border-none",
            !hasNextPage && "opacity-50 pointer-events-none"
          )}
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
        >
          <span className="max-sm:hidden">Last</span>
          <ChevronsLeftRight className="w-4 h-4 -ml-1" />
        </Button>
      </div>

      {/* Page Count */}
      <div className="text-sm font-medium text-text_color text-center sm:text-right">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
