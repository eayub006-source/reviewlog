import { memo } from "react";
import { CalendarDays, Pencil, Trash2, Globe2, LockKeyhole } from "lucide-react";

import Badge from "@/components/common/Badge";
import RatingStars from "@/components/common/RatingStars";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const preview = review.content?.length > 160 ? `${review.content.slice(0, 160).trimEnd()}...` : review.content;
  const visibility = review.is_public ? "Public" : "Private";

  return (
    <Card className={cn("border-slate-200 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg", className)}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-slate-950">{review.title}</h3>
              <Badge tone={review.is_public ? "success" : "subtle"}>
                {review.is_public ? <Globe2 className="mr-1 h-3 w-3" /> : <LockKeyhole className="mr-1 h-3 w-3" />}
                {visibility}
              </Badge>
            </div>
            {showAuthor ? (
              <p className="mt-1 text-sm text-slate-500">{review.author ?? review.username ?? review.user?.username ?? "Unknown author"}</p>
            ) : null}
          </div>
          <Badge tone="warning">{review.rating}/5</Badge>
        </div>

        <RatingStars rating={review.rating} showValue />

        <p className="text-sm leading-6 text-slate-600">{preview}</p>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatReviewDate(review.date)}
          </div>

          {showActions ? (
            <div className="flex items-center gap-2">
              {onEdit ? (
                <Button variant="outline" size="sm" className="h-9 rounded-full px-3" onClick={() => onEdit(review)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : null}
              {onDelete ? (
                <Button variant="destructive" size="sm" className="h-9 rounded-full px-3" onClick={() => onDelete(review)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
});

export default ReviewCard;
