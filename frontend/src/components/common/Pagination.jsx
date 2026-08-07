import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      <p>
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 rounded-full px-3" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <Button variant="outline" size="sm" className="h-9 rounded-full px-3" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
