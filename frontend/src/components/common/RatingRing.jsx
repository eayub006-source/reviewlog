import { memo } from "react";

const RatingRing = memo(function RatingRing({ value = 0, size = 42, strokeWidth = 3.5 }) {
  // Convert 0-5 rating to percentage
  const percentage = Math.max(0, Math.min(100, Math.round((value / 5) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // TMDB color transitions depending on score:
  // > 4.0: emerald-400, 3.0 - 4.0: amber-400, < 3.0: rose-500
  let strokeColor = "stroke-emerald-400";
  if (value < 3) {
    strokeColor = "stroke-rose-500";
  } else if (value < 4) {
    strokeColor = "stroke-amber-400";
  }

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Background track circle */}
      <svg className="w-full h-full -rotate-90">
        <circle
          className="stroke-white/10"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated active stroke */}
        <circle
          className={`${strokeColor} transition-all duration-500 ease-out`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Inner score value text */}
      <span className="absolute text-[11px] font-extrabold text-slate-100 font-sans tracking-tighter">
        {value > 0 ? value.toFixed(1) : "NR"}
      </span>
    </div>
  );
});

export default RatingRing;