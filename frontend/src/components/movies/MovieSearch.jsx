import { useEffect, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import MovieResults from "@/components/movies/MovieResults";
import { useMovieSearch } from "@/hooks/useMovieSearch";
import { getTrendingMovies } from "@/services/movieService";

function MovieSearch({ onSelect, onFavorite, initialQuery = "" }) {
  const { query, setQuery, results, loading, error, errorKind, hasQuery, retry, hasMore, loadMore } = useMovieSearch(initialQuery);
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setRecLoading(true);
    getTrendingMovies()
      .then((res) => {
        if (mounted) {
          setRecommended(res.results || []);
        }
      })
      .catch((err) => console.error("Error fetching recommended movies:", err))
      .finally(() => {
        if (mounted) {
          setRecLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

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
        recommended={recommended}
        recLoading={recLoading}
      />
    </div>
  );
}

export default MovieSearch;
