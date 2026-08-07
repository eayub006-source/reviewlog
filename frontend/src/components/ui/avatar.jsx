import { cn } from "@/lib/utils";

function Avatar({ className, name = "User", src, alt, size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
  };

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 font-semibold text-white shadow-sm",
        sizeClasses[size] ?? sizeClasses.md,
        className,
      )}
      aria-label={alt || name}
      role="img"
    >
      {src ? <img src={src} alt={alt || name} className="h-full w-full object-cover" /> : initials}
    </div>
  );
}

export default Avatar;
