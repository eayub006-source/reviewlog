import { AlertCircle, BookOpen, SearchX } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import MediaCard from "@/components/common/MediaCard";
import { SearchResultsSkeleton } from "@/components/common/Skeleton";
import { EXTERNAL_ERROR_KIND } from "@/utils/externalApiErrors";

function BookResults({ results, loading, error, errorKind, hasQuery, onRetry, onSelect, onFavorite, hasMore, onLoadMore }) {
  if (!hasQuery) {
    return (
      <div className="py-12">
        <EmptyState
          icon={BookOpen}
          title="Search for a book"
          description="Enter a title or author to search the catalog and log your review."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Loader label="Searching catalog..." />
        <SearchResultsSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    const isEmpty = errorKind === EXTERNAL_ERROR_KIND.EMPTY;
    return (
      <div className="py-12">
        <EmptyState
          icon={isEmpty ? SearchX : AlertCircle}
          title={isEmpty ? "No books found" : "Search failed"}
          description={error}
          actionLabel={isEmpty ? undefined : "Retry search"}
          onAction={isEmpty ? undefined : onRetry}
        />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={SearchX}
          title="No books found"
          description="Try adjusting your search terms."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"} found</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {results.map((book) => (
          <MediaCard 
            key={book.id ?? book.openLibraryKey} 
            item={book} 
            type="book" 
            onSelect={onSelect} 
            onFavorite={onFavorite} 
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button type="button" className="btn btn-outline px-8" onClick={onLoadMore}>
            Load more results
          </button>
        </div>
      )}
    </div>
  );
}

export default BookResults;