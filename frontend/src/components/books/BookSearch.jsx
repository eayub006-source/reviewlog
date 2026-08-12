import { useEffect, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import BookResults from "@/components/books/BookResults";
import { useBookSearch } from "@/hooks/useBookSearch";
import { getPopularBooks } from "@/services/openLibraryService";

function BookSearch({ onSelect, onFavorite, initialQuery = "" }) {
  const { query, setQuery, results, loading, error, errorKind, hasQuery, retry, hasMore, loadMore } = useBookSearch(initialQuery);
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setRecLoading(true);
    getPopularBooks()
      .then((res) => {
        if (mounted) {
          setRecommended(res.results || []);
        }
      })
      .catch((err) => console.error("Error fetching recommended books:", err))
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
        placeholder="Search books by title or author..."
      />
      <BookResults
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

export default BookSearch;
