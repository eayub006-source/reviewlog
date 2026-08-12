import { memo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = memo(function Carousel({ children, title, description }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  return (
    <section className="space-y-4">
      {/* Title & Navigation Header */}
      <div className="flex items-end justify-between">
        <div>
          {title && <h2 className="text-xl font-bold tracking-tight text-slate-100">{title}</h2>}
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"
            aria-label="Scroll left"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"
            aria-label="Scroll right"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroller lane */}
      <div
        ref={scrollRef}
        className="flex w-full gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </section>
  );
});

export default Carousel;