import { memo } from "react";
import { BookOpen, Film, Heart } from "lucide-react";
import RatingRing from "./RatingRing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MediaCard = memo(function MediaCard({
  item,
  type = "movie", // 'movie' or 'book'
  onSelect,
  onFavorite,
  isFavorite = false,
  showActions = true,
}) {
  // Extract unified metadata
  const title = item.title ?? "Untitled";
  const image = type === "movie" ? item.posterUrl : item.coverUrl;
  
  // Extract year
  let year = "";
  if (type === "movie" && item.releaseDate) {
    year = item.releaseDate.slice(0, 4);
  } else if (type === "book" && item.firstPublishYear) {
    year = String(item.firstPublishYear);
  }

  // Extract subtitle (Author for books, or empty for movies)
  const subtitle = type === "book" ? (item.author ?? "Unknown Author") : "";
  const ratingValue = type === "movie" ? (item.averageRating ?? 0) : 0;

  return (
    <article className="group relative flex flex-col rounded-2xl bg-slate-900/40 border border-white/5 overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] hover:border-white/10 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.6)]">
      {/* 2:3 Aspect Ratio Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center bg-slate-950">
            {type === "book" ? (
              <BookOpen className="h-10 w-10 text-slate-700" />
            ) : (
              <Film className="h-10 w-10 text-slate-700" />
            )}
            <span className="mt-2 text-xs font-semibold text-slate-500 line-clamp-2">{title}</span>
          </div>
        )}

        {/* Rating Ring Overlay (only for movies, or books if they have a rating) */}
        {type === "movie" && ratingValue > 0 ? (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-slate-950/80 p-0.5 backdrop-blur-md">
            <RatingRing value={ratingValue} />
          </div>
        ) : null}

        {/* Type Badge Overlay */}
        <div className="absolute right-3 top-3 z-10 rounded-lg bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-white/5 backdrop-blur-sm">
          {type}
        </div>

        {/* Action Button Overlays (fade-in on hover) */}
        {showActions && (
          <div className="absolute inset-0 bg-slate-950/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 gap-2">
            {onSelect && (
              <Button
                size="sm"
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl h-9"
                onClick={() => onSelect(item)}
              >
                Write Review
              </Button>
            )}
            {onFavorite && (
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "w-full rounded-xl h-9 border-white/10 text-slate-200 hover:bg-white/10",
                  isFavorite && "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}
                onClick={() => onFavorite(item)}
              >
                <Heart className={cn("h-4 w-4 mr-1", isFavorite && "fill-current")} />
                {isFavorite ? "Favorited" : "Favorite"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Info details under poster */}
      <div className="flex flex-col p-3 flex-1 justify-between gap-1">
        <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-1 group-hover:text-sky-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-400 gap-2">
          <span className="truncate max-w-[140px]">{subtitle}</span>
          {year && <span className="font-bold shrink-0">{year}</span>}
        </div>
      </div>
    </article>
  );
});

export default MediaCard;