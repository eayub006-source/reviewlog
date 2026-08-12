import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { LoaderCircle, Save, ChevronLeft, Globe2, LockKeyhole } from "lucide-react";

import { FormSkeleton } from "@/components/common/Skeleton";
import { useReviews } from "@/hooks/useReviews";
import { getFriendlyApiError } from "@/utils/apiErrors";
import { cn } from "@/lib/utils";

const INITIAL_FORM = {
  title: "",
  content: "",
  rating: "5",
  is_public: false,
};

function ReviewForm() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const reviewId = params.reviewId;
  const isEditMode = Boolean(reviewId);
  const { getReviewById, createReview, updateReview } = useReviews({ scope: "mine", enabled: false });

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const externalItem = useMemo(() => {
    try { return JSON.parse(searchParams.get("item") || "null"); } catch { return null; }
  }, [searchParams]);

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
        if (mounted) setError(getFriendlyApiError(caughtError));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadReview();
    return () => { mounted = false; };
  }, [getReviewById, isEditMode, reviewId]);

  useEffect(() => {
    if (!isEditMode && externalItem) {
      setForm((current) => ({ ...current, title: externalItem.title || current.title }));
    }
  }, [externalItem, isEditMode]);

  const validation = useMemo(() => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.content.trim()) next.content = "Content is required.";
    if (!form.rating) next.rating = "Rating is required.";
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
      item_type: externalItem?.type ?? "internal_review",
      item_id: externalItem?.id ?? "",
      external_source: externalItem?.source ?? "",
      image: externalItem?.image ?? "",
      metadata: externalItem?.metadata ?? {},
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

  if (loading) return <FormSkeleton />;

  return (
    <div className="max-w-3xl mx-auto pb-10 space-y-8">
      <div>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary mb-4 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
        <h1 className="page-title mb-1">
          {isEditMode ? "Edit your entry" : "Write a new entry"}
        </h1>
        <p className="body-text">
          {isEditMode ? "Refine your thoughts on this story." : "Log your thoughts and rate your experience."}
        </p>
      </div>

      <div className="surface-panel p-6 md:p-10 relative overflow-hidden">
        {/* Subtle Decorative Sunburst */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[radial-gradient(circle_at_center,_#fcf3d9_0%,_transparent_70%)] opacity-40 pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Review Title</label>
              <div className="relative">
                <input
                  name="title"
                  className={cn("field h-12", validation.title && "border-destructive focus:ring-destructive/20")}
                  placeholder="The name of the book or film..."
                  value={form.title}
                  onChange={handleChange}
                  maxLength={100}
                />
                <span className="absolute right-3 bottom-[-22px] text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-tighter">
                  {titleCount}/100 characters
                </span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <select 
                  name="rating" 
                  value={form.rating} 
                  onChange={handleChange} 
                  className="field h-12 appearance-none cursor-pointer"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Visibility</label>
                <div className="flex items-center gap-2 p-1 bg-muted rounded-xl border border-border h-12">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, is_public: true }))}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all h-full",
                      form.is_public ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground"
                    )}
                  >
                    <Globe2 className="w-3.5 h-3.5" /> Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, is_public: false }))}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all h-full",
                      !form.is_public ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground"
                    )}
                  >
                    <LockKeyhole className="w-3.5 h-3.5" /> Private
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Your Thoughts</label>
              <div className="relative">
                <textarea
                  name="content"
                  className={cn("field min-h-[220px] py-4 resize-y", validation.content && "border-destructive focus:ring-destructive/20")}
                  placeholder="What did you think about this story? Would you recommend it?"
                  value={form.content}
                  onChange={handleChange}
                  maxLength={2000}
                />
                <span className="absolute right-3 bottom-[-22px] text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-tighter">
                  {contentCount}/2000 characters
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive bg-[#fce8e8] p-4">
              <p className="text-sm text-destructive font-semibold">{error}</p>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
             <Link to="/reviews" className="btn btn-ghost px-8 order-2 sm:order-1">
               Discard
             </Link>
             <button 
              type="submit" 
              disabled={submitting} 
              className="btn btn-primary px-10 order-1 sm:order-2"
            >
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {isEditMode ? "Update Journal" : "Save Journal Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;