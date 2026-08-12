import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import MediaCard from "@/components/common/MediaCard";
import { SearchResultsSkeleton } from "@/components/common/Skeleton";
import { getFavorites, removeFavorite } from "@/services/favoriteService";
import { useToast } from "@/hooks/useToast";
import { getFriendlyApiError } from "@/utils/apiErrors";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getFavorites()
      .then((data) => {
        setFavorites(data || []);
      })
      .catch((caughtError) => {
        setFavorites([]);
        const message = getFriendlyApiError(caughtError);
        setError(message);
        showToast({
          tone: "error",
          title: "Failed to load favorites",
          description: message,
        });
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  async function remove(item) {
    try {
      await removeFavorite(item.id);
      setFavorites((items) => items.filter((i) => i.id !== item.id));
      showToast({
        tone: "success",
        title: "Favorite removed",
        description: "The item has been removed from your vault.",
      });
    } catch (caughtError) {
      showToast({
        tone: "error",
        title: "Failed to remove favorite",
        description: getFriendlyApiError(caughtError),
      });
    }
  }

  // Format helper for MediaCard
  const toMediaItem = (item) => ({
    id: item.item_id,
    title: item.title,
    posterUrl: item.item_type === "movie" ? item.image : null,
    coverUrl: item.item_type === "book" ? item.image : null,
    releaseDate: item.metadata?.releaseDate,
    firstPublishYear: item.metadata?.firstPublishYear,
    author: item.metadata?.author,
    averageRating: item.metadata?.averageRating,
    overview: item.metadata?.overview,
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-title mb-1">Your Favorites Vault</h1>
          <p className="body-text">
            A private collection of the stories and films you love most.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive bg-[#fce8e8] p-4 text-sm text-destructive font-semibold">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-8">
          <SearchResultsSkeleton count={8} />
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-16">
          <EmptyState 
            icon={Heart} 
            title="Your vault is empty" 
            description="Save movies or books while browsing to build your personal collection."
            actionLabel="Discover Media"
            onAction={() => navigate("/dashboard")}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 mt-8">
          {favorites.map((item) => (
            <MediaCard
              key={item.id}
              item={toMediaItem(item)}
              type={item.item_type}
              isFavorite={true}
              onFavorite={() => remove(item)}
              onSelect={() =>
                navigate(
                  `/reviews/new?item=${encodeURIComponent(
                    JSON.stringify({
                      type: item.item_type,
                      id: item.item_id,
                      source: item.external_source,
                      title: item.title,
                      image: item.image,
                      metadata: item.metadata,
                    })
                  )}`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;