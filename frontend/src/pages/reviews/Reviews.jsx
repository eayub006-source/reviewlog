import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Badge from "@/components/common/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ReviewCard from "@/components/common/ReviewCard";
import SearchBar from "@/components/common/SearchBar";
import { ReviewListSkeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/common/DashboardCard";
import { useReviews } from "@/hooks/useReviews";
import { useToast } from "@/hooks/useToast";
import { getFriendlyApiError } from "@/utils/apiErrors";
import { Select } from "@/components/ui/select";

const PAGE_SIZE = 6;

function Reviews() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { reviews, loading, error, deleteReview, refreshReviews } = useReviews({ scope: "mine" });
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState("");

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
    if (!deleteTarget) {
      return;
    }

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
      setActionError(getFriendlyApiError(caughtError));
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
    <div className="space-y-6">
      <DashboardCard title="My Reviews" description="Search, filter, sort, and manage your private review entries.">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={query} onChange={(event) => handleParams({ q: event.target.value, page: 1 })} className="w-full lg:max-w-md" />
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: "All" },
              { key: "public", label: "Public" },
              { key: "private", label: "Private" },
            ].map((item) => (
              <Button
                key={item.key}
                variant={visibility === item.key ? "default" : "outline"}
                size="sm"
                className="h-9 rounded-full px-4"
                onClick={() => handleParams({ visibility: item.key, page: 1 })}
              >
                {item.label}
              </Button>
            ))}
            <Select
              value={sort}
              onChange={(event) => handleParams({ sort: event.target.value, page: 1 })}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </Select>
            <Button className="h-9 rounded-full px-4" onClick={() => navigate("/reviews/new") }>
              <PlusCircle className="h-4 w-4" />
              Create Review
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
          <Badge tone="subtle">Sort: {sort}</Badge>
          <Badge tone="subtle">Page {currentPage}</Badge>
          <Badge tone="subtle">{filteredReviews.length} results</Badge>
        </div>
      </DashboardCard>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {actionError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</div> : null}

      {pageReviews.length === 0 ? (
        <EmptyState
          title="No reviews found"
          description="Your filters returned no reviews. Reset filters or create a new review to get started."
          actionLabel="Create Review"
          onAction={() => navigate("/reviews/new")}
        />
      ) : (
        <div className="grid gap-4">
          {pageReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={() => navigate(`/reviews/${review.id}/edit`)}
              onDelete={() => setDeleteTarget(review)}
            />
          ))}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={(nextPage) => handleParams({ page: nextPage })} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete review?"
        description={`This will permanently delete ${deleteTarget?.title ?? "this review"}. This action cannot be undone.`}
        confirmLabel="Delete review"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Reviews;
