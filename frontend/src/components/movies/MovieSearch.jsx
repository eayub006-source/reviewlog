import SearchBar from "@/components/common/SearchBar";
import MovieResults from "@/components/movies/MovieResults";
import { useMovieSearch } from "@/hooks/useMovieSearch";

function MovieSearch({ onSelect, onFavorite, initialQuery = "" }) {
  const { query, setQuery, results, loading, error, errorKind, hasQuery, retry, hasMore, loadMore } = useMovieSearch(initialQuery);

  return (
    <div className="space-y-5">
      <SearchBar
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies by title..."
      />
      <MovieResults
        results={results}
        loading={loading}
        error={error}
        errorKind={errorKind}
        hasQuery={hasQuery}
        onRetry={retry}
        onSelect={onSelect}
        onFavorite={onFavorite}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}

export default MovieSearch;
