import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchX, LayoutGrid, List } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ReviewCard from "@/components/common/ReviewCard";
import SearchBar from "@/components/common/SearchBar";
import { ReviewListSkeleton } from "@/components/common/Skeleton";
import { useReviews } from "@/hooks/useReviews";
import { useToast } from "@/hooks/useToast";
import { getFriendlyApiError } from "@/utils/apiErrors";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

function Reviews() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { reviews, loading, deleteReview, refreshReviews } = useReviews({ scope: "mine" });
  const { showToast } = useToast();
  
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "grid" or "list"

  const query = searchParams.get("q") ?? "";
  const visibility = searchParams.get("visibility") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);

  const filteredReviews = useMemo(() => {
    const queryValue = query.trim().toLowerCase();

    const data = reviews.filter((review) => {
      const matchesQuery = !queryValue || review.title?.toLowerCase().includes(queryValue);
      const matchesVisibility =
        visibility === "all" ||
        (visibility === "public" && review.is_public) ||
        (visibility === "private" && !review.is_public);

      return matchesQuery && matchesVisibility;
    });

    const sorted = [...data].sort((left, right) => {
      const leftDate = new Date(left.date).getTime();
      const rightDate = new Date(right.date).getTime();

      switch (sort) {
        case "oldest":
          return leftDate - rightDate;
        case "highest":
          return Number(right.rating) - Number(left.rating);
        case "lowest":
          return Number(left.rating) - Number(right.rating);
        default:
          return rightDate - leftDate;
      }
    });

    return sorted;
  }, [query, reviews, sort, visibility]);

  const totalPages = Math.max(Math.ceil(filteredReviews.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const pageReviews = useMemo(
    () => filteredReviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, filteredReviews],
  );

  useEffect(() => {
    if (location.state?.toast) {
      showToast(location.state.toast);
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location.pathname, location.search, location.state, navigate, showToast]);

  const handleParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      if (!updates.page) {
        next.set("page", "1");
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      await deleteReview(deleteTarget.id);
      setDeleteTarget(null);
      await refreshReviews();
      showToast({
        tone: "success",
        title: "Review deleted",
        description: "The selected review was removed successfully.",
      });
    } catch (caughtError) {
      showToast({
        tone: "error",
        title: "Delete failed",
        description: getFriendlyApiError(caughtError),
      });
    }
  }, [deleteReview, deleteTarget, refreshReviews, showToast]);

  if (loading) {
    return <ReviewListSkeleton />;
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-title mb-1">My Journal</h1>
          <p className="body-text">
            Explore and manage your personal reviews collection.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => navigate("/reviews/new")}>
            Write Review
          </button>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="surface-panel p-4 md:px-6 rounded-2xl flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar 
            value={query} 
            onChange={(event) => handleParams({ q: event.target.value, page: 1 })} 
            placeholder="Search your reviews..." 
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg">
            {[
              { key: "all", label: "All" },
              { key: "public", label: "Public" },
              { key: "private", label: "Private" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleParams({ visibility: item.key, page: 1 })}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-semibold transition-colors",
                  visibility === item.key 
                    ? "bg-card text-foreground shadow-sm border border-border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              className="field h-[38px] py-1 pl-3 pr-8 appearance-none bg-muted text-sm font-semibold cursor-pointer border-transparent hover:border-border"
              value={sort}
              onChange={(e) => handleParams({ sort: e.target.value, page: 1 })}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center border-l border-border pl-4 gap-2">
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
      </div>

      {/* Feed Content */}
      {pageReviews.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={SearchX}
            title={query || visibility !== "all" ? "No matches found" : "Your journal is empty"}
            description={
              query || visibility !== "all"
                ? "Try adjusting your filters or search term."
                : "You haven't written any reviews yet."
            }
            actionLabel={query || visibility !== "all" ? "Clear Filters" : "Write a Review"}
            onAction={() => (query || visibility !== "all" ? handleParams({ q: "", visibility: "all", sort: "newest", page: 1 }) : navigate("/reviews/new"))}
          />
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4 max-w-4xl mx-auto"}>
          {pageReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={(target) => navigate(`/reviews/${target.id}/edit`)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => handleParams({ page: nextPage })}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Review"
        description={`Are you sure you want to delete your review of ${deleteTarget?.title ?? "this review"}? This action cannot be undone.`}
        confirmLabel="Delete review"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Reviews;