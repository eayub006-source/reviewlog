import { memo, useMemo } from "react";
import { CalendarDays, Pencil, Trash2, Globe2, LockKeyhole, EllipsisVertical } from "lucide-react";

import Badge from "@/components/common/Badge";
import DropdownMenu from "@/components/common/DropdownMenu";
import RatingStars from "@/components/common/RatingStars";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function formatReviewDate(dateValue) {
  if (!dateValue) {
    return "Unknown date";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

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
    <Card className={cn("border-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl", className)}>
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">{review.title}</h3>
              <Badge tone={review.is_public ? "success" : "subtle"}>
                {review.is_public ? <Globe2 className="mr-1 h-3 w-3" /> : <LockKeyhole className="mr-1 h-3 w-3" />}
                {visibility}
              </Badge>
            </div>
            {showAuthor ? (
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={authorName} size="sm" />
                <div>
                  <p className="text-sm font-medium text-slate-950">{authorName}</p>
                  <p className="text-xs text-slate-500">Published review</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge tone="warning">{review.rating}/5</Badge>
            {showActions && menuItems.length > 0 ? (
              <DropdownMenu
                triggerLabel={<EllipsisVertical className="h-4 w-4" />}
                buttonClassName="h-9 w-9 rounded-full px-0"
                align="right"
                items={menuItems}
              />
            ) : null}
          </div>
        </div>

        <RatingStars rating={review.rating} showValue />

        <p className="text-sm leading-6 text-slate-600">{preview}</p>

        <div className="grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2 sm:items-center sm:justify-between text-sm text-slate-500">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Created {formatReviewDate(review.date)}
            </span>
            <span>Last updated {formatReviewDate(lastUpdated)}</span>
          </div>

          {showActions && menuItems.length > 0 ? <span className="text-right text-xs text-slate-400">Actions in menu</span> : null}
        </div>
      </CardContent>
    </Card>
  );
});

export default ReviewCard;
