import { memo } from "react";

const HeroBanner = memo(function HeroBanner({
  item,
  type = "movie",
  onSelect,
}) {
  if (!item) return null;

  const title = item.title ?? "Untitled";
  const image = type === "movie" ? item.posterUrl : item.coverUrl;
  
  let year = "";
  if (type === "movie" && item.releaseDate) {
    year = item.releaseDate.slice(0, 4);
  } else if (type === "book" && item.firstPublishYear) {
    year = String(item.firstPublishYear);
  }

  const subtitle = type === "book" ? (item.author ?? "Unknown Author") : "";
  const description = type === "movie" ? item.overview : "No description available.";

  return (
    <div className="surface-card relative overflow-hidden rounded-2xl flex flex-col md:flex-row bg-[#e8e3dc] mb-8">
      {/* Background Poster Blur (only if no backdrop is available) */}
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center blur-2xl" 
        style={{ backgroundImage: `url(${image})` }} 
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 p-5 sm:p-6 md:p-10 flex flex-col justify-center">
        <div className="mb-4">
          <span className="pill bg-primary/10 text-primary border-primary/20 mb-3 inline-block">
            Featured {type === "movie" ? "Film" : "Book"}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h2>
          <div className="flex items-center gap-3 mt-3 text-sm font-semibold text-muted-foreground">
            {year && <span>{year}</span>}
            {subtitle && (
              <>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{subtitle}</span>
              </>
            )}
          </div>
        </div>

        <p className="body-text line-clamp-3 md:line-clamp-4 max-w-2xl mb-8">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-auto">
          {onSelect && (
            <button
              onClick={() => onSelect(item)}
              className="btn btn-secondary px-6"
            >
              Write Review
            </button>
          )}
        </div>
      </div>

      {/* Poster Art (Right rail on desktop, stacked banner below content on mobile) */}
      <div className="relative z-10 w-full md:w-[30%] shrink-0 aspect-[16/9] md:aspect-auto border-t md:border-t-0 md:border-l border-border bg-[#dcd7d0]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
    </div>
  );
});

export default HeroBanner;