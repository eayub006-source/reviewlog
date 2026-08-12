import { AlertCircle, Film, SearchX } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import MediaCard from "@/components/common/MediaCard";
import { SearchResultsSkeleton } from "@/components/common/Skeleton";
import { EXTERNAL_ERROR_KIND } from "@/utils/externalApiErrors";

function MovieResults({ results, loading, error, errorKind, hasQuery, onRetry, onSelect, onFavorite, hasMore, onLoadMore, recommended = [], recLoading = false }) {
  if (!hasQuery) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Recommended Movies</h2>
          <p className="body-text text-sm">Trending and highly popular movies in the catalog today.</p>
        </div>
        {recLoading ? (
          <SearchResultsSkeleton count={6} />
        ) : recommended && recommended.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {recommended.map((movie) => (
              <MediaCard 
                key={movie.id} 
                item={{
                  id: movie.id,
                  title: movie.title,
                  posterUrl: movie.image,
                  releaseDate: movie.releaseDate,
                  averageRating: movie.averageRating,
                  overview: movie.overview,
                }} 
                type="movie" 
                onSelect={(m) => onSelect({
                  id: m.id,
                  title: m.title,
                  posterUrl: m.posterUrl,
                  releaseDate: m.releaseDate,
                  averageRating: m.averageRating,
                  overview: m.overview,
                })} 
                onFavorite={(m) => onFavorite({
                  id: m.id,
                  title: m.title,
                  posterUrl: m.posterUrl,
                  releaseDate: m.releaseDate,
                  averageRating: m.averageRating,
                  overview: m.overview,
                })} 
              />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              icon={Film}
              title="Search for a movie"
              description="Enter a title to search the catalog and log your review."
            />
          </div>
        )}
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
          title={isEmpty ? "No movies found" : "Search failed"}
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
          title="No movies found"
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
        {results.map((movie) => (
          <MediaCard 
            key={movie.id ?? movie.tmdbId} 
            item={movie} 
            type="movie" 
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

export default MovieResults;