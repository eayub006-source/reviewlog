import api from "@/api/axios";

function normalizeBook(doc) {
  return {
    id: doc.id,
    title: doc.title ?? "Untitled",
    authors: Array.isArray(doc.author_name) ? doc.author_name : [],
    author: doc.author_name?.[0] ?? "Unknown author",
    firstPublishYear: doc.first_publish_year ?? null,
    editionCount: doc.edition_count ?? null,
    coverUrl: doc.image || null,
    openLibraryKey: doc.id ?? null,
  };
}

export async function searchBooks(query, { signal, page = 1 } = {}) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const response = await api.get("catalog/books/", { params: { q: trimmedQuery, page }, signal });
  return { results: (response.data.results ?? []).map(normalizeBook), hasMore: Boolean(response.data.has_more) };
}

export function buildBookReviewTitle(book) {
  const yearSuffix = book.firstPublishYear ? ` (${book.firstPublishYear})` : "";

  return `${book.title} by ${book.author}${yearSuffix}`;
}
