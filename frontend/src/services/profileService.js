import api from "@/api/axios";

let profileCache = null;
let profilePromise = null;

export async function getProfile({ force = false } = {}) {
  if (profileCache && !force) {
    return profileCache;
  }

  if (profilePromise && !force) {
    return profilePromise;
  }

  profilePromise = api
    .get("profile/")
    .then((response) => {
      profileCache = response.data;
      return profileCache;
    })
    .finally(() => {
      profilePromise = null;
    });

  return profilePromise;
}

export async function updateProfile(profileData) {
  const response = await api.patch("profile/", profileData);
  profileCache = response.data;
  return response.data;
}

export function getCachedProfile() {
  return profileCache;
}

export function clearProfileCache() {
  profileCache = null;
  profilePromise = null;
}
