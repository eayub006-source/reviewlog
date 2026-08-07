import SearchBar from "@/components/common/SearchBar";
import BookResults from "@/components/books/BookResults";
import { useBookSearch } from "@/hooks/useBookSearch";

function BookSearch({ onSelect, onFavorite, initialQuery = "" }) {
  const { query, setQuery, results, loading, error, errorKind, hasQuery, retry, hasMore, loadMore } = useBookSearch(initialQuery);

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
      />
    </div>
  );
}

export default BookSearch;
