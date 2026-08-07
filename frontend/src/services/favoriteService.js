import api from "@/api/axios";

export async function getFavorites() {
  const response = await api.get("favorites/");
  return response.data;
}

export async function saveFavorite(item) {
  const response = await api.post("favorites/", item);
  return response.data;
}

export async function removeFavorite(id) {
  await api.delete(`favorites/${id}/`);
}

export async function saveRecentItem(item) {
  const response = await api.post("recent-items/", item);
  return response.data;
}

export async function getRecentItems() {
  const response = await api.get("recent-items/");
  return response.data;
}
