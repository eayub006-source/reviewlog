import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Film, BookOpen, Compass, LoaderCircle } from "lucide-react";

import { useToast } from "@/hooks/useToast";
import MediaCard from "@/components/common/MediaCard";
import { SearchResultsSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { searchMovies } from "@/services/movieService";
import { searchBooks } from "@/services/openLibraryService";

function Discover() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "movies", "books"
  const [loading, setLoading] = useState(false);
  
  const [movieResults, setMovieResults] = useState([]);
  const [bookResults, setBookResults] = useState([]);

  // Debounce search effect
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMovieResults([]);
      setBookResults([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const [movies, books] = await Promise.all([
          activeTab === "all" || activeTab === "movies" ? searchMovies(trimmed, { signal: controller.signal }) : Promise.resolve({ results: [] }),
          activeTab === "all" || activeTab === "books" ? searchBooks(trimmed, { signal: controller.signal }) : Promise.resolve({ results: [] })
        ]);
        
        setMovieResults(movies.results || []);
        setBookResults(books.results || []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          showToast({ tone: "error", title: "Search failed", description: "Could not complete the discovery search." });
        }
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, activeTab, showToast]);

  const toMediaItem = (item, type) => {
    if (type === "movie") {
      return {
        id: item.id,
        title: item.title,
        posterUrl: item.posterUrl,
        releaseDate: item.releaseDate,
        overview: item.overview,
        averageRating: item.averageRating,
      };
    }
    return {
      id: item.id,
      title: item.title,
      coverUrl: item.coverUrl,
      firstPublishYear: item.firstPublishYear,
      author: item.author,
    };
  };

  const handleSelect = (item, type) => {
    const source = type === "movie" ? "tmdb" : "openlibrary";
    navigate(`/reviews/new?item=${encodeURIComponent(
      JSON.stringify({
        type: type,
        id: item.id,
        source: source,
        title: item.title,
        image: type === "movie" ? item.posterUrl : item.coverUrl,
        metadata: item
      })
    )}`);
  };

  const renderGrid = (items, type) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={toMediaItem(item, type)}
          type={type}
          onSelect={() => handleSelect(item, type)}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center max-w-2xl mx-auto pt-8 pb-4">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Global Discovery</h1>
        <p className="body-text text-lg">
          Search across our entire catalog of films and literature to find your next great story.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative shadow-md rounded-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            className="w-full h-14 pl-14 pr-6 rounded-xl border border-border bg-card text-lg outline-none focus:border-primary focus:ring-4 focus:ring-ring transition-all placeholder:text-muted-foreground"
            placeholder="Search for movies or books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <LoaderCircle className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
          )}
        </div>

        <div className="flex justify-center mt-6 gap-2">
          <button 
            className={`px-5 py-2 rounded-full font-semibold transition-colors ${activeTab === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("all")}
          >
            All Results
          </button>
          <button 
            className={`px-5 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${activeTab === "movies" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("movies")}
          >
            <Film className="h-4 w-4" /> Movies
          </button>
          <button 
            className={`px-5 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${activeTab === "books" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("books")}
          >
            <BookOpen className="h-4 w-4" /> Books
          </button>
        </div>
      </div>

      {loading && !movieResults.length && !bookResults.length ? (
        <div className="pt-8"><SearchResultsSkeleton count={10} /></div>
      ) : query && !movieResults.length && !bookResults.length ? (
        <div className="py-12">
          <EmptyState icon={Compass} title="No results found" description={`We couldn't find anything matching "${query}".`} />
        </div>
      ) : (
        <div className="space-y-10 pt-4">
          {(activeTab === "all" || activeTab === "movies") && movieResults.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Films</h2>
              {renderGrid(movieResults, "movie")}
            </section>
          )}

          {(activeTab === "all" || activeTab === "books") && bookResults.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Literature</h2>
              {renderGrid(bookResults, "book")}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default Discover;