import api from "@/api/axios";

function normalizeMovie(result) {
  return {
    id: result.id,
    title: result.title ?? "Untitled",
    releaseDate: result.release_date ?? null,
    overview: result.overview ?? "No overview available.",
    averageRating: typeof result.vote_average === "number" ? result.vote_average : null,
    posterUrl: result.image || null,
    tmdbId: result.id,
  };
}

export async function searchMovies(query, { signal, page = 1 } = {}) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const response = await api.get("catalog/movies/", { params: { q: trimmedQuery, page }, signal });
  return { results: (response.data.results ?? []).map(normalizeMovie), hasMore: Boolean(response.data.has_more) };
}

export function buildMovieReviewTitle(movie) {
  const year = movie.releaseDate?.slice(0, 4);

  return year ? `${movie.title} (${year})` : movie.title;
}

export async function getTrendingMovies() {
  const response = await api.get("catalog/recommendations/movies/");
  return response.data;
}
