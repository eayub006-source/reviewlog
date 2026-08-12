import { memo, useMemo } from "react";
import { CalendarDays, Pencil, Trash2, Globe2, LockKeyhole, EllipsisVertical } from "lucide-react";

import DropdownMenu from "@/components/common/DropdownMenu";
import RatingStars from "@/components/common/RatingStars";
import Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function formatReviewDate(dateValue) {
  if (!dateValue) return "Unknown date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const ReviewCard = memo(function ReviewCard({
  review,
  onEdit,
  onDelete,
  showActions = true,
  showAuthor = false,
  className = "",
}) {
  const authorName = review.author ?? review.username ?? review.user?.username ?? "Unknown author";
  const lastUpdated = review.updated_at ?? review.updated ?? review.modified_at ?? review.date;
  const preview = review.content?.length > 160 ? `${review.content.slice(0, 160).trimEnd()}...` : review.content;
  const visibility = review.is_public ? "Public" : "Private";
  
  const menuItems = useMemo(
    () => [
      onEdit ? { label: "Edit", icon: Pencil, onSelect: () => onEdit(review) } : null,
      onDelete ? { label: "Delete", icon: Trash2, tone: "danger", onSelect: () => onDelete(review) } : null,
    ].filter(Boolean),
    [onDelete, onEdit, review],
  );

  return (
    <article className={cn("surface-card flex flex-col gap-4 p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="card-title truncate text-base">{review.title}</h3>
            <span className="pill flex items-center gap-1">
              {review.is_public ? <Globe2 className="h-3 w-3" /> : <LockKeyhole className="h-3 w-3" />}
              {visibility}
            </span>
          </div>
          
          <RatingStars rating={review.rating} />

          {showAuthor && (
            <div className="mt-4 flex items-center gap-2">
              <Avatar name={authorName} size="sm" className="bg-primary text-primary-foreground font-bold" />
              <div>
                <p className="text-sm font-semibold text-foreground">{authorName}</p>
                <p className="text-xs text-muted-foreground">Reviewer</p>
              </div>
            </div>
          )}
        </div>
        
        {showActions && menuItems.length > 0 && (
          <div className="shrink-0 -mr-2 -mt-2">
            <DropdownMenu
              triggerLabel={<EllipsisVertical className="h-5 w-5 text-muted-foreground" />}
              buttonClassName="h-9 w-9 rounded-full px-0 hover:bg-muted bg-transparent border-transparent"
              menuClassName="bg-card border-border shadow-lg"
              align="right"
              items={menuItems}
            />
          </div>
        )}
      </div>

      {review.content && (
        <div className="mt-1">
          <p className="body-text text-sm">
            {preview}
          </p>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <CalendarDays className="h-3.5 w-3.5 opacity-70" />
          <span>{formatReviewDate(review.date)}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50 font-bold">
          Updated {formatReviewDate(lastUpdated)}
        </span>
      </div>
    </article>
  );
});

export default ReviewCard;