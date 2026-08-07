import { BookOpen, CalendarDays, Heart, Layers3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function BookCard({ book, onSelect, onFavorite, className = "" }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(book)}
      onKeyDown={(event) => event.key === "Enter" && onSelect?.(book)}
      className={cn("w-full text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950", className)}
    >
      <Card className="h-full border-slate-200">
        <CardContent className="flex gap-4 p-4">
          <div className="flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={`${book.title} cover`} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <BookOpen className="h-8 w-8 text-slate-400" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex gap-2"><h3 className="line-clamp-2 flex-1 text-base font-semibold text-slate-950">{book.title}</h3>{onFavorite ? <button type="button" aria-label={`Favorite ${book.title}`} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-rose-500" onClick={(event) => { event.stopPropagation(); onFavorite(book); }}><Heart className="h-4 w-4" /></button> : null}</div>
            <p className="text-sm text-slate-600">{book.author}</p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              {book.firstPublishYear ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {book.firstPublishYear}
                </span>
              ) : null}
              {book.editionCount ? (
                <span className="inline-flex items-center gap-1">
                  <Layers3 className="h-3.5 w-3.5" />
                  {book.editionCount} editions
                </span>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookCard;
