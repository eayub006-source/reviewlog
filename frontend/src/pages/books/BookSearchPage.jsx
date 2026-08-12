import BookSearch from "@/components/books/BookSearch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveFavorite, saveRecentItem } from "@/services/favoriteService";
import { useToast } from "@/hooks/useToast";
import { getFriendlyApiError } from "@/utils/apiErrors";

function BookSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const toItem = (book) => ({
    item_type: "book",
    item_id: book.id,
    external_source: "openlibrary",
    title: book.title,
    image: book.coverUrl,
    metadata: {
      author: book.author,
      firstPublishYear: book.firstPublishYear,
      editionCount: book.editionCount
    }
  });

  const handleSelect = async (book) => {
    const item = toItem(book);
    try {
      await saveRecentItem(item);
    } catch (err) {
      console.error("Failed to save recent item:", err);
    }
    navigate(`/reviews/new?item=${encodeURIComponent(JSON.stringify({
      type: "book",
      id: book.id,
      source: "openlibrary",
      title: book.title,
      image: book.coverUrl,
      metadata: item.metadata
    }))}`);
  };

  const handleFavorite = async (book) => {
    try {
      await saveFavorite(toItem(book));
      showToast({
        tone: "success",
        title: "Favorite saved",
        description: `${book.title} was added to favorites.`
      });
    } catch (err) {
      showToast({
        tone: "error",
        title: "Failed to save favorite",
        description: getFriendlyApiError(err)
      });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="page-title mb-1">Book Discovery</h1>
        <p className="body-text max-w-2xl">
          Search the catalog to discover books and log your literary journey.
        </p>
      </div>

      <div className="surface-panel p-6 md:p-8">
        <BookSearch
          initialQuery={searchParams.get("q") || ""}
          onSelect={handleSelect}
          onFavorite={handleFavorite}
        />
      </div>
    </div>
  );
}

export default BookSearchPage;
