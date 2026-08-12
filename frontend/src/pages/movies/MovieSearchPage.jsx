import MovieSearch from "@/components/movies/MovieSearch";
import DashboardCard from "@/components/common/DashboardCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveFavorite, saveRecentItem } from "@/services/favoriteService";
import { useToast } from "@/hooks/useToast";
import { getFriendlyApiError } from "@/utils/apiErrors";

function MovieSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const toItem = (movie) => ({
    item_type: "movie",
    item_id: String(movie.id),
    external_source: "tmdb",
    title: movie.title,
    image: movie.posterUrl,
    metadata: {
      releaseDate: movie.releaseDate,
      overview: movie.overview,
      averageRating: movie.averageRating
    }
  });

  const handleSelect = async (movie) => {
    const item = toItem(movie);
    try {
      await saveRecentItem(item);
    } catch (err) {
      console.error("Failed to save recent item:", err);
    }
    navigate(`/reviews/new?item=${encodeURIComponent(JSON.stringify({
      type: "movie",
      id: movie.id,
      source: "tmdb",
      title: movie.title,
      image: movie.posterUrl,
      metadata: item.metadata
    }))}`);
  };

  const handleFavorite = async (movie) => {
    try {
      await saveFavorite(toItem(movie));
      showToast({
        tone: "success",
        title: "Favorite saved",
        description: `${movie.title} was added to favorites.`
      });
    } catch (err) {
      showToast({
        tone: "error",
        title: "Failed to save favorite",
        description: getFriendlyApiError(err)
      });
    }
  };

  return (
    <DashboardCard
      title="Search Movies"
      description="Find a movie on TMDB and use it to pre-fill your review."
    >
      <MovieSearch
        initialQuery={searchParams.get("q") || ""}
        onSelect={handleSelect}
        onFavorite={handleFavorite}
      />
    </DashboardCard>
  );
}

export default MovieSearchPage;
