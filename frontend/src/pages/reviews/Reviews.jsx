import { useEffect, useState } from "react";
import { BookOpen, LoaderCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReviews } from "@/services/reviewService";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      try {
        const data = await getReviews();
        if (mounted) {
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch {
        if (mounted) {
          setError("Unable to load your reviews right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-600">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        Loading reviews...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Your protected review feed</CardDescription>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            <BookOpen className="h-4 w-4 text-slate-400" />
            No reviews yet. Create your first review in the next phase.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">{review.title}</h3>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                    {review.rating}/5
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{review.content}</p>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Reviews;
