import { memo } from "react";
import { Star } from "lucide-react";

const RatingStars = memo(function RatingStars({ rating = 0, className = "", showValue = false }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`.trim()}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Number(rating);
        return (
          <Star
            key={index}
            className={filled ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-slate-700"}
          />
        );
      })}
      {showValue ? <span className="ml-1 text-xs font-semibold text-slate-400">{rating}/5</span> : null}
    </div>
  );
});

export default RatingStars;