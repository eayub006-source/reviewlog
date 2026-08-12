import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, LayoutGrid, List } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { ReviewListSkeleton } from "@/components/common/Skeleton";
import Pagination from "@/components/common/Pagination";
import ReviewCard from "@/components/common/ReviewCard";
import SearchBar from "@/components/common/SearchBar";
import { useReviews } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

function PublicReviews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { reviews, loading, error } = useReviews({ scope: "public" });
  
  const [viewMode, setViewMode] = useState("list"); // "grid" or "list"
  
  const query = searchParams.get("q") ?? "";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);

  const filteredReviews = useMemo(() => {
    const queryValue = query.trim().toLowerCase();
    return [...reviews].filter((review) => !queryValue || review.title?.toLowerCase().includes(queryValue));
  }, [query, reviews]);

  const totalPages = Math.max(Math.ceil(filteredReviews.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const pageReviews = filteredReviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(event) {
    const next = new URLSearchParams(searchParams);
    const value = event.target.value;

    if (value) {
      next.set("q", value);
    } else {
      next.delete("q");
    }

    next.set("page", "1");
    setSearchParams(next, { replace: true });
  }

  if (loading) {
    return <ReviewListSkeleton />;
  }

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-title mb-1">Community Feed</h1>
          <p className="body-text">
            Discover thoughts and reviews shared by the community.
          </p>
        </div>
      </div>

      <div className="surface-panel p-4 md:px-6 rounded-2xl flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar 
            value={query} 
            onChange={handleSearchChange} 
            placeholder="Search community reviews..." 
          />
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded-md transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-1.5 rounded-md transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive bg-[#fce8e8] p-4 text-sm text-destructive font-semibold">
          {error}
        </div>
      ) : null}

      {pageReviews.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={SearchX}
            title={query ? "No matches found" : "No public reviews yet"}
            description={
              query
                ? "Try adjusting your search term."
                : "When users publish reviews, they will appear here."
            }
          />
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4 max-w-4xl mx-auto"}>
          {pageReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              showAuthor 
              showActions={false} 
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(nextPage));
              setSearchParams(next, { replace: true });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PublicReviews;