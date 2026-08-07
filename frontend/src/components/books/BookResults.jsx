import { AlertCircle, BookOpen, RefreshCw, SearchX } from "lucide-react";

import BookCard from "@/components/books/BookCard";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import { SearchResultsSkeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/ui/button";
import { EXTERNAL_ERROR_KIND } from "@/utils/externalApiErrors";

function BookResults({ results, loading, error, errorKind, hasQuery, onRetry, onSelect, onFavorite, hasMore, onLoadMore }) {
  if (!hasQuery) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Search for a book"
        description="Enter a title or author to find books from Open Library and pre-fill your review."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Loader label="Searching Open Library..." />
        <SearchResultsSkeleton />
      </div>
    );
  }

  if (error) {
    const isEmpty = errorKind === EXTERNAL_ERROR_KIND.EMPTY;

    return (
      <EmptyState
        icon={isEmpty ? SearchX : AlertCircle}
        title={isEmpty ? "No books found" : "Search failed"}
        description={error}
        actionLabel={isEmpty ? undefined : "Retry"}
        onAction={isEmpty ? undefined : onRetry}
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No books found"
        description="Try another title or author name."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{results.length} result{results.length === 1 ? "" : "s"} found</p>
        <Button type="button" variant="outline" className="rounded-2xl px-4" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((book) => (
          <BookCard key={book.id ?? book.openLibraryKey} book={book} onSelect={onSelect} onFavorite={onFavorite} />
        ))}
      </div>
      {hasMore ? <Button type="button" variant="outline" className="w-full rounded-2xl" onClick={onLoadMore}>Load more books</Button> : null}
    </div>
  );
}

export default BookResults;
