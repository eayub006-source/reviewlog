import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createReview as createReviewRequest,
  deleteReview as deleteReviewRequest,
  getReviews,
  updateReview as updateReviewRequest,
  getReviewById as getReviewByIdRequest,
} from "@/services/reviewService";
import { getFriendlyApiError } from "@/utils/apiErrors";

export function useReviews({ scope = "mine", enabled = true } = {}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");

  const loadReviews = useCallback(
    async ({ force = false } = {}) => {
      if (!enabled) {
        return [];
      }

      setLoading(true);
      setError("");

      try {
        const data = await getReviews({ scope, force });
        setReviews(Array.isArray(data) ? data : []);
        return data;
      } catch (caughtError) {
        const message = getFriendlyApiError(caughtError);
        setError(message);
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [enabled, scope],
  );

  useEffect(() => {
    loadReviews().catch(() => undefined);
  }, [loadReviews]);

  const api = useMemo(
    () => ({
      reviews,
      loading,
      error,
      refreshReviews: () => loadReviews({ force: true }),
      async createReview(reviewData) {
        const created = await createReviewRequest(reviewData);
        await loadReviews({ force: true });
        return created;
      },
      async updateReview(reviewId, reviewData) {
        const updated = await updateReviewRequest(reviewId, reviewData);
        await loadReviews({ force: true });
        return updated;
      },
      async deleteReview(reviewId) {
        const removed = await deleteReviewRequest(reviewId);
        await loadReviews({ force: true });
        return removed;
      },
      async getReviewById(reviewId) {
        return getReviewByIdRequest(reviewId);
      },
    }),
    [loadReviews, loading, error, reviews],
  );

  return api;
}
