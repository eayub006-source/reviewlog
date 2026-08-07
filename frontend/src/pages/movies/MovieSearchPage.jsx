import MovieSearch from "@/components/movies/MovieSearch";
import DashboardCard from "@/components/common/DashboardCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveFavorite, saveRecentItem } from "@/services/favoriteService";
import { useToast } from "@/hooks/useToast";

function MovieSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const toItem = (movie) => ({ item_type: "movie", item_id: String(movie.id), external_source: "tmdb", title: movie.title, image: movie.posterUrl, metadata: { releaseDate: movie.releaseDate, overview: movie.overview, averageRating: movie.averageRating } });
  return (
    <DashboardCard
      title="Search Movies"
      description="Find a movie on TMDB and use it to pre-fill your review."
    >
      <MovieSearch initialQuery={searchParams.get("q") || ""} onSelect={(movie) => { const item = toItem(movie); saveRecentItem(item).catch(() => undefined); navigate(`/reviews/new?item=${encodeURIComponent(JSON.stringify({ type: "movie", id: movie.id, source: "tmdb", title: movie.title, image: movie.posterUrl, metadata: item.metadata }))}`); }} onFavorite={async (movie) => { await saveFavorite(toItem(movie)); showToast({ tone: "success", title: "Favorite saved", description: `${movie.title} was added to favorites.` }); }} />
    </DashboardCard>
  );
}

export default MovieSearchPage;
