import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, NotebookText } from "lucide-react";

import { useProfile } from "@/hooks/useProfile";
import { useReviews } from "@/hooks/useReviews";
import { useToast } from "@/hooks/useToast";
import { getFavorites, getRecentItems } from "@/services/favoriteService";
import { getTrendingMovies } from "@/services/movieService";
import { getPopularBooks } from "@/services/openLibraryService";
import HeroBanner from "@/components/common/HeroBanner";
import Carousel from "@/components/common/Carousel";
import MediaCard from "@/components/common/MediaCard";
import ReviewCard from "@/components/common/ReviewCard";
import Skeleton from "@/components/common/Skeleton";

function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { reviews, loading } = useReviews({ scope: "mine" });
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState({ favorites: [], recent: [] });
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

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

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getTrendingMovies().catch(() => ({ results: [] })),
      getPopularBooks().catch(() => ({ results: [] }))
    ])
      .then(([moviesRes, booksRes]) => {
        if (mounted) {
          setRecommendedMovies(moviesRes.results || []);
          setRecommendedBooks(booksRes.results || []);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRecommendSelect = useCallback((item, type) => {
    const serialized = JSON.stringify({
      type,
      id: item.id,
      source: item.source || (type === "movie" ? "tmdb" : "openlibrary"),
      title: item.title,
      image: item.image,
      metadata: type === "movie" ? {
        releaseDate: item.releaseDate,
        averageRating: item.averageRating,
        overview: item.overview
      } : {
        author: item.author,
        firstPublishYear: item.firstPublishYear
      }
    });
    navigate(`/reviews/new?item=${encodeURIComponent(serialized)}`);
  }, [navigate]);

  const handleMediaSelect = useCallback((item) => {
    handleRecommendSelect(item, item.type || item.item_type || "movie");
  }, [handleRecommendSelect]);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const booksReviewed = reviews.filter((r) => r.item_type === "book").length;
    const moviesReviewed = reviews.filter((r) => r.item_type === "movie").length;
    return { totalReviews, booksReviewed, moviesReviewed };
  }, [reviews]);

  const recentReviews = useMemo(() => 
    [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4), 
  [reviews]);

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
      {catalogLoading ? (
        <Skeleton className="min-h-[300px] w-full rounded-2xl" />
      ) : featuredItem ? (
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
      {catalogLoading ? (
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[240px] w-[160px] sm:w-[180px] shrink-0" />
          ))}
        </div>
      ) : (
        <>
          {catalog.recent.length > 0 && (
            <Carousel title="Recently Viewed" description="Jump back into items you explored recently.">
              {catalog.recent.map((item) => (
                <div key={item.id} className="w-[160px] sm:w-[180px] shrink-0 snap-start">
                  <MediaCard
                    item={toMediaItem(item)}
                    type={item.item_type}
                    onSelect={handleMediaSelect}
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
                    onSelect={handleMediaSelect}
                  />
                </div>
              ))}
            </Carousel>
          )}
        </>
      )}

      {/* Recommended Movies Section */}
      {recommendedMovies.length > 0 && (
        <Carousel title="Recommended Movies" description="Trending films popular among the ReviewLog community.">
          {recommendedMovies.map((item) => (
            <div key={item.id} className="w-[160px] sm:w-[180px] shrink-0 snap-start">
              <MediaCard
                item={{
                  id: item.id,
                  title: item.title,
                  posterUrl: item.image,
                  releaseDate: item.releaseDate,
                  averageRating: item.averageRating,
                  overview: item.overview,
                  type: "movie"
                }}
                type="movie"
                showActions={true}
                onSelect={handleMediaSelect}
              />
            </div>
          ))}
        </Carousel>
      )}

      {/* Recommended Books Section */}
      {recommendedBooks.length > 0 && (
        <Carousel title="Recommended Books" description="Popular literature recommended for your collection.">
          {recommendedBooks.map((item) => (
            <div key={item.id} className="w-[160px] sm:w-[180px] shrink-0 snap-start">
              <MediaCard
                item={{
                  id: item.id,
                  title: item.title,
                  coverUrl: item.image,
                  firstPublishYear: item.firstPublishYear,
                  author: item.author,
                  type: "book"
                }}
                type="book"
                showActions={true}
                onSelect={handleMediaSelect}
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
        
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : recentReviews.length === 0 ? (
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
        {[
          { label: "Total Reviews", value: stats.totalReviews, ready: !loading },
          { label: "Films Logged", value: stats.moviesReviewed, ready: !loading },
          { label: "Books Logged", value: stats.booksReviewed, ready: !loading },
          { label: "Favorites", value: catalog.favorites.length, ready: !catalogLoading },
        ].map((stat) => (
          <div key={stat.label} className="surface-card p-5 text-center">
            {stat.ready ? (
              <p className="text-3xl font-heading font-bold text-foreground">{stat.value}</p>
            ) : (
              <Skeleton className="h-9 w-12 mx-auto" />
            )}
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1 font-bold">{stat.label}</p>
          </div>
        ))}
      </section>

    </div>
  );
}

export default Dashboard;
