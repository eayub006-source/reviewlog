import { AlertCircle, Film, RefreshCw, SearchX } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import MovieCard from "@/components/movies/MovieCard";
import { SearchResultsSkeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/ui/button";
import { EXTERNAL_ERROR_KIND } from "@/utils/externalApiErrors";

function MovieResults({ results, loading, error, errorKind, hasQuery, onRetry, onSelect, onFavorite, hasMore, onLoadMore }) {
  if (!hasQuery) {
    return (
      <EmptyState
        icon={Film}
        title="Search for a movie"
        description="Enter a movie title to search TMDB and pre-fill your review."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Loader label="Searching TMDB..." />
        <SearchResultsSkeleton />
      </div>
    );
  }

  if (error) {
    const isEmpty = errorKind === EXTERNAL_ERROR_KIND.EMPTY;

    return (
      <EmptyState
        icon={isEmpty ? SearchX : AlertCircle}
        title={isEmpty ? "No movies found" : "Search failed"}
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
        title="No movies found"
        description="Try another movie title."
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
        {results.map((movie) => (
          <MovieCard key={movie.id ?? movie.tmdbId} movie={movie} onSelect={onSelect} onFavorite={onFavorite} />
        ))}
      </div>
      {hasMore ? <Button type="button" variant="outline" className="w-full rounded-2xl" onClick={onLoadMore}>Load more movies</Button> : null}
    </div>
  );
}

export default MovieResults;
