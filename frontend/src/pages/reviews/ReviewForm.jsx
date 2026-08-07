import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderCircle, Save } from "lucide-react";

import Badge from "@/components/common/Badge";
import DashboardCard from "@/components/common/DashboardCard";
import { FormSkeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/hooks/useReviews";
import { getFriendlyApiError } from "@/utils/apiErrors";

const INITIAL_FORM = {
  title: "",
  content: "",
  rating: "5",
  is_public: false,
};

function ReviewForm() {
  const navigate = useNavigate();
  const params = useParams();
  const reviewId = params.reviewId;
  const isEditMode = Boolean(reviewId);
  const { getReviewById, createReview, updateReview } = useReviews({ scope: "mine", enabled: false });

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const contentCount = form.content.length;
  const titleCount = form.title.length;

  useEffect(() => {
    let mounted = true;

    async function loadReview() {
      if (!isEditMode) {
        setLoading(false);
        return;
      }

      try {
        const review = await getReviewById(reviewId);
        if (mounted) {
          setForm({
            title: review.title ?? "",
            content: review.content ?? "",
            rating: String(review.rating ?? 5),
            is_public: Boolean(review.is_public),
          });
        }
      } catch (caughtError) {
        if (mounted) {
          setError(getFriendlyApiError(caughtError));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReview();

    return () => {
      mounted = false;
    };
  }, [getReviewById, isEditMode, reviewId]);

  const validation = useMemo(() => {
    const next = {};

    if (!form.title.trim()) {
      next.title = "Title is required.";
    }

    if (!form.content.trim()) {
      next.content = "Content is required.";
    }

    if (!form.rating) {
      next.rating = "Rating is required.";
    }

    return next;
  }, [form.content, form.rating, form.title]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (Object.keys(validation).length > 0) {
      setError("Please complete the required fields.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      rating: Number(form.rating),
      is_public: form.is_public,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      if (isEditMode) {
        await updateReview(reviewId, payload);
      } else {
        await createReview(payload);
      }

      navigate("/reviews", {
        replace: true,
        state: {
          toast: {
            tone: "success",
            title: isEditMode ? "Review updated" : "Review created",
            description: isEditMode ? "Your changes were saved successfully." : "Your review was saved successfully.",
          },
        },
      });
    } catch (caughtError) {
      setError(getFriendlyApiError(caughtError));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <DashboardCard
      title={isEditMode ? "Edit Review" : "Create Review"}
      description="Save a new review or update an existing one using the deployed API."
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Enter review title" />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{validation.title ?? " "}</span>
            <span>{titleCount}/255</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" name="content" value={form.content} onChange={handleChange} placeholder="Write your review" />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{validation.content ?? " "}</span>
            <span>{contentCount}/2000</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} Stars
                </option>
              ))}
            </Select>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <Checkbox name="is_public" checked={form.is_public} onChange={handleChange} />
            Make this review public
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone={form.is_public ? "success" : "subtle"}>{form.is_public ? "Public" : "Private"}</Badge>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" className="rounded-2xl px-5" onClick={() => navigate("/reviews")}>Cancel</Button>
            <Button type="submit" className="rounded-2xl px-5" disabled={submitting}>
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {submitting ? "Saving..." : isEditMode ? "Update Review" : "Create Review"}
            </Button>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      </form>
    </DashboardCard>
  );
}

export default ReviewForm;
