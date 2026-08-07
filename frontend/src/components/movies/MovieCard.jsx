import { CalendarDays, Film, Heart, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function MovieCard({ movie, onSelect, onFavorite, className = "" }) {
  return (
    <div role="button" tabIndex={0}
      onClick={() => onSelect?.(movie)}
      onKeyDown={(event) => event.key === "Enter" && onSelect?.(movie)}
      className={cn("w-full text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950", className)}
    >
      <Card className="h-full border-slate-200">
        <CardContent className="flex gap-4 p-4">
          <div className="flex h-36 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <Film className="h-8 w-8 text-slate-400" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex gap-2"><h3 className="line-clamp-2 flex-1 text-base font-semibold text-slate-950">{movie.title}</h3>{onFavorite ? <button type="button" aria-label={`Favorite ${movie.title}`} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-rose-500" onClick={(event) => { event.stopPropagation(); onFavorite(movie); }}><Heart className="h-4 w-4" /></button> : null}</div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              {movie.releaseDate ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {movie.releaseDate}
                </span>
              ) : null}
              {typeof movie.averageRating === "number" ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {movie.averageRating.toFixed(1)}/10
                </span>
              ) : null}
            </div>
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">{movie.overview}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MovieCard;
