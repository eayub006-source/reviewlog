import { useCallback, useEffect, useRef, useState } from "react";

import { SEARCH_DEBOUNCE_MS } from "@/constants/externalApis";
import { searchBooks } from "@/services/openLibraryService";
import { classifyExternalError } from "@/utils/externalApiErrors";

export function useBookSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorKind, setErrorKind] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query]);

  const runSearch = useCallback(async (searchQuery, nextPage = 1, append = false) => {
    abortRef.current?.abort();

    if (!searchQuery) {
      setResults([]);
      setPage(1);
      setHasMore(false);
      setError(null);
      setErrorKind(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setErrorKind(null);

    try {
      const data = await searchBooks(searchQuery, { signal: controller.signal, page: nextPage });
      const books = data.results;

      if (controller.signal.aborted) {
        return;
      }

      if (books.length === 0) {
        const classified = classifyExternalError(null, { emptyResults: true });
        setResults([]);
        setError(classified.message);
        setErrorKind(classified.kind);
        return;
      }

      setResults((current) => append ? [...current, ...books] : books);
      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch (caughtError) {
      if (controller.signal.aborted) {
        return;
      }

      const classified = classifyExternalError(caughtError);
      setResults([]);
      setError(classified.message);
      setErrorKind(classified.kind);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const retry = useCallback(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);
  const loadMore = useCallback(() => runSearch(debouncedQuery, page + 1, true), [debouncedQuery, page, runSearch]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    errorKind,
    hasQuery: Boolean(debouncedQuery),
    retry,
    hasMore,
    loadMore,
  };
}
