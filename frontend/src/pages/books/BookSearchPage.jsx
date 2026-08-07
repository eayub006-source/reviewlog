import BookSearch from "@/components/books/BookSearch";
import DashboardCard from "@/components/common/DashboardCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveFavorite, saveRecentItem } from "@/services/favoriteService";
import { useToast } from "@/hooks/useToast";

function BookSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const toItem = (book) => ({ item_type: "book", item_id: book.id, external_source: "openlibrary", title: book.title, image: book.coverUrl, metadata: { author: book.author, firstPublishYear: book.firstPublishYear, editionCount: book.editionCount } });
  return (
    <DashboardCard
      title="Search Books"
      description="Find a book on Open Library and use it to pre-fill your review."
    >
      <BookSearch initialQuery={searchParams.get("q") || ""} onSelect={(book) => { const item = toItem(book); saveRecentItem(item).catch(() => undefined); navigate(`/reviews/new?item=${encodeURIComponent(JSON.stringify({ type: "book", id: book.id, source: "openlibrary", title: book.title, image: book.coverUrl, metadata: item.metadata }))}`); }} onFavorite={async (book) => { await saveFavorite(toItem(book)); showToast({ tone: "success", title: "Favorite saved", description: `${book.title} was added to favorites.` }); }} />
    </DashboardCard>
  );
}

export default BookSearchPage;
