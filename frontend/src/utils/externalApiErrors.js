export const EXTERNAL_ERROR_KIND = {
  NETWORK: "network",
  EMPTY: "empty",
  INVALID_API_KEY: "invalid_api_key",
  RATE_LIMIT: "rate_limit",
  CONFIG: "config",
  UNKNOWN: "unknown",
};

export function classifyExternalError(error, { emptyResults = false } = {}) {
  if (emptyResults) {
    return {
      kind: EXTERNAL_ERROR_KIND.EMPTY,
      message: "No results found. Try a different search term.",
    };
  }

  const status = error?.status ?? error?.response?.status;

  if (status === 401 || status === 403) {
    return {
      kind: EXTERNAL_ERROR_KIND.INVALID_API_KEY,
      message: "The TMDB API key is invalid or missing. Check VITE_TMDB_API_KEY in your .env file.",
    };
  }

  if (status === 429) {
    return {
      kind: EXTERNAL_ERROR_KIND.RATE_LIMIT,
      message: "Too many requests. Please wait a moment and try again.",
    };
  }

  if (error?.kind === EXTERNAL_ERROR_KIND.CONFIG) {
    return {
      kind: EXTERNAL_ERROR_KIND.CONFIG,
      message: error.message,
    };
  }

  if (error?.name === "TypeError" || !navigator.onLine) {
    return {
      kind: EXTERNAL_ERROR_KIND.NETWORK,
      message: "Network error. Check your connection and try again.",
    };
  }

  return {
    kind: EXTERNAL_ERROR_KIND.UNKNOWN,
    message: error?.message ?? "Something went wrong while searching. Please try again.",
  };
}
