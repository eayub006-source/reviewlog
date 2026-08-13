import api from "@/api/axios";

let cache = {
  favorites: null,
  recent: null,
};

let promise = {
  favorites: null,
  recent: null,
};

export function clearFavoriteCache() {
  cache.favorites = null;
  cache.recent = null;
  promise.favorites = null;
  promise.recent = null;
}

export async function getFavorites({ force = false } = {}) {
  if (cache.favorites && !force) return cache.favorites;
  if (promise.favorites && !force) return promise.favorites;

  promise.favorites = api.get("favorites/").then((res) => {
    cache.favorites = res.data;
    return cache.favorites;
  }).finally(() => {
    promise.favorites = null;
  });
  return promise.favorites;
}

export async function saveFavorite(item) {
  const response = await api.post("favorites/", item);
  cache.favorites = null;
  return response.data;
}

export async function removeFavorite(id) {
  await api.delete(`favorites/${id}/`);
  cache.favorites = null;
}

export async function saveRecentItem(item) {
  const response = await api.post("recent-items/", item);
  cache.recent = null;
  return response.data;
}

export async function getRecentItems({ force = false } = {}) {
  if (cache.recent && !force) return cache.recent;
  if (promise.recent && !force) return promise.recent;

  promise.recent = api.get("recent-items/").then((res) => {
    cache.recent = res.data;
    return cache.recent;
  }).finally(() => {
    promise.recent = null;
  });
  return promise.recent;
}
