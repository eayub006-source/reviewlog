import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardCard from "@/components/common/DashboardCard";
import EmptyState from "@/components/common/EmptyState";
import { ReviewListSkeleton } from "@/components/common/Skeleton";
import Pagination from "@/components/common/Pagination";
import ReviewCard from "@/components/common/ReviewCard";
import SearchBar from "@/components/common/SearchBar";
import { useReviews } from "@/hooks/useReviews";

const PAGE_SIZE = 6;

function PublicReviews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { reviews, loading, error } = useReviews({ scope: "public" });
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
    <div className="space-y-6">
      <DashboardCard title="Public Reviews" description="Browse published reviews from the community.">
        <SearchBar value={query} onChange={handleSearchChange} className="w-full lg:max-w-md" />
      </DashboardCard>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      {pageReviews.length === 0 ? (
        <EmptyState
          title="No public reviews yet"
          description="Once users publish reviews, they will appear here with pagination and search."
        />
      ) : (
        <div className="grid gap-4">
          {pageReviews.map((review) => (
            <ReviewCard key={review.id} review={review} showAuthor showActions={false} />
          ))}
        </div>
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(nextPage) => {
          const next = new URLSearchParams(searchParams);
          next.set("page", String(nextPage));
          setSearchParams(next, { replace: true });
        }}
      />
    </div>
  );
}

export default PublicReviews;
