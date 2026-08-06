import api from "@/api/axios";

const reviewCache = {
  mine: null,
  public: null,
};

const reviewPromise = {
  mine: null,
  public: null,
};

function resolveScope(scope = "mine") {
  return scope === "public" ? "public" : "mine";
}

function endpointForScope(scope) {
  return resolveScope(scope) === "public" ? "public-reviews/" : "reviews/";
}

function invalidateMine() {
  reviewCache.mine = null;
}

function invalidatePublic() {
  reviewCache.public = null;
}

export function clearReviewCache() {
  reviewCache.mine = null;
  reviewCache.public = null;
  reviewPromise.mine = null;
  reviewPromise.public = null;
}

export async function getReviews({ scope = "mine", force = false } = {}) {
  const normalizedScope = resolveScope(scope);

  if (reviewCache[normalizedScope] && !force) {
    return reviewCache[normalizedScope];
  }

  if (reviewPromise[normalizedScope] && !force) {
    return reviewPromise[normalizedScope];
  }

  reviewPromise[normalizedScope] = api
    .get(endpointForScope(normalizedScope))
    .then((response) => {
      reviewCache[normalizedScope] = Array.isArray(response.data) ? response.data : [];
      return reviewCache[normalizedScope];
    })
    .finally(() => {
      reviewPromise[normalizedScope] = null;
    });

  return reviewPromise[normalizedScope];
}

export async function getReviewById(id) {
  const response = await api.get(`reviews/${id}/`);
  return response.data;
}

export async function createReview(reviewData) {
  const response = await api.post("reviews/", reviewData);
  invalidateMine();
  return response.data;
}

export async function updateReview(id, reviewData) {
  const response = await api.put(`reviews/${id}/`, reviewData);
  invalidateMine();
  return response.data;
}

export async function deleteReview(id) {
  const response = await api.delete(`reviews/${id}/`);
  invalidateMine();
  return response.data;
}

export function upsertMineReview(review) {
  if (!reviewCache.mine) {
    return;
  }

  reviewCache.mine = reviewCache.mine.map((existing) => (existing.id === review.id ? review : existing));
}

export function removeMineReview(reviewId) {
  if (!reviewCache.mine) {
    return;
  }

  reviewCache.mine = reviewCache.mine.filter((review) => review.id !== reviewId);
}
