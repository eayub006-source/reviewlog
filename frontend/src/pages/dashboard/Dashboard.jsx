import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, NotebookText } from "lucide-react";

import { useProfile } from "@/hooks/useProfile";
import { useReviews } from "@/hooks/useReviews";
import { useToast } from "@/hooks/useToast";
import { getFavorites, getRecentItems } from "@/services/favoriteService";
import HeroBanner from "@/components/common/HeroBanner";
import Carousel from "@/components/common/Carousel";
import MediaCard from "@/components/common/MediaCard";
import ReviewCard from "@/components/common/ReviewCard";
import { DashboardSkeleton } from "@/components/common/Skeleton";

function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { reviews, loading } = useReviews({ scope: "mine" });
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState({ favorites: [], recent: [] });
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFavorites(), getRecentItems()])
      .then(([favorites, recent]) => {
        setCatalog({ favorites: favorites || [], recent: recent || [] });
      })
      .catch(() => {
        showToast({
          tone: "error",
          title: "Dashboard sync failed",
          description: "Could not load your saved favorites or recently viewed items."
        });
      })
      .finally(() => setCatalogLoading(false));
  }, [showToast]);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const booksReviewed = reviews.filter((r) => r.item_type === "book").length;
    const moviesReviewed = reviews.filter((r) => r.item_type === "movie").length;
    return { totalReviews, booksReviewed, moviesReviewed };
  }, [reviews]);

  const recentReviews = useMemo(() => 
    [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4), 
  [reviews]);

  if (!profile || loading || catalogLoading) {
    return <DashboardSkeleton />;
  }

  // Determine the featured item for the HeroBanner
  const featuredItem = catalog.recent.length > 0 
    ? catalog.recent[0] 
    : catalog.favorites.length > 0 ? catalog.favorites[0] : null;

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
    <div className="space-y-12 pb-10">
      
      {/* Dynamic Greeting */}
      <div>
        <h1 className="page-title mb-1 text-4xl">
          Good to see you, {profile?.username ?? "Traveller"}.
        </h1>
        <p className="body-text text-lg">
          Your private library is waiting. Discover new stories and log your thoughts.
        </p>
      </div>

      {/* Cinematic Hero Spotlight */}
      {featuredItem ? (
        <HeroBanner
          item={toMediaItem(featuredItem)}
          type={featuredItem.item_type}
          onSelect={() => navigate(`/reviews/new?item=${encodeURIComponent(
            JSON.stringify({
              type: featuredItem.item_type,
              id: featuredItem.item_id,
              source: featuredItem.external_source,
              title: featuredItem.title,
              image: featuredItem.image,
              metadata: featuredItem.metadata
            })
          )}`)}
        />
      ) : (
        <div className="surface-card p-12 text-center rounded-2xl bg-[#e8e3dc] flex flex-col items-center justify-center min-h-[300px]">
          <Compass className="h-12 w-12 text-primary mb-4 opacity-50" />
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Your library is empty</h2>
          <p className="body-text max-w-md">
            Start searching for books and movies to populate your featured dashboard spotlight.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="btn btn-primary" onClick={() => navigate("/movies")}>Find Movies</button>
            <button className="btn btn-outline" onClick={() => navigate("/books")}>Find Books</button>
          </div>
        </div>
      )}

      {/* Horizontal Carousels */}
      {catalog.recent.length > 0 && (
        <Carousel title="Recently Viewed" description="Jump back into items you explored recently.">
          {catalog.recent.map((item) => (
            <div key={item.id} className="w-[160px] sm:w-[180px] shrink-0 snap-start">
              <MediaCard
                item={toMediaItem(item)}
                type={item.item_type}
                onSelect={() => navigate(`/reviews/new?item=${encodeURIComponent(
                  JSON.stringify({
                    type: item.item_type,
                    id: item.item_id,
                    source: item.external_source,
                    title: item.title,
                    image: item.image,
                    metadata: item.metadata
                  })
                )}`)}
              />
            </div>
          ))}
        </Carousel>
      )}

      {catalog.favorites.length > 0 && (
        <Carousel title="Your Favorites Vault" description="Books and movies you've saved for later.">
          {catalog.favorites.map((item) => (
            <div key={item.id} className="w-[160px] sm:w-[180px] shrink-0 snap-start">
              <MediaCard
                item={toMediaItem(item)}
                type={item.item_type}
                isFavorite={true}
                onSelect={() => navigate(`/reviews/new?item=${encodeURIComponent(
                  JSON.stringify({
                    type: item.item_type,
                    id: item.item_id,
                    source: item.external_source,
                    title: item.title,
                    image: item.image,
                    metadata: item.metadata
                  })
                )}`)}
              />
            </div>
          ))}
        </Carousel>
      )}

      {/* Recent Reviews Feed */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">Latest Journal Entries</h2>
          {reviews.length > 0 && (
            <button onClick={() => navigate("/reviews")} className="text-sm font-semibold text-primary hover:text-[#244820]">
              View all reviews →
            </button>
          )}
        </div>
        
        {recentReviews.length === 0 ? (
          <div className="surface-card p-10 text-center flex flex-col items-center">
            <NotebookText className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
            <p className="text-foreground font-semibold">No journal entries yet.</p>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              Review a movie or book to see your activity here.
            </p>
            <button className="btn btn-secondary" onClick={() => navigate("/reviews/new")}>
              Write a Review
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} showActions={false} />
            ))}
          </div>
        )}
      </section>

      {/* Mini Stats Footer */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="surface-card p-5 text-center">
          <p className="text-3xl font-heading font-bold text-foreground">{stats.totalReviews}</p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1 font-bold">Total Reviews</p>
        </div>
        <div className="surface-card p-5 text-center">
          <p className="text-3xl font-heading font-bold text-foreground">{stats.moviesReviewed}</p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1 font-bold">Films Logged</p>
        </div>
        <div className="surface-card p-5 text-center">
          <p className="text-3xl font-heading font-bold text-foreground">{stats.booksReviewed}</p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1 font-bold">Books Logged</p>
        </div>
        <div className="surface-card p-5 text-center">
          <p className="text-3xl font-heading font-bold text-foreground">{catalog.favorites.length}</p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1 font-bold">Favorites</p>
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
