const HISTORY_KEY = "reviewlog:search-history";

export function getSearchHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}

export function saveSearchHistory(query) {
  const value = query.trim();
  if (!value) return;
  const next = [value, ...getSearchHistory().filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}
