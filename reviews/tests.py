from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import CatalogItem, Review


class ExternalReviewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="reviewer", password="safe-password-123")
        self.client.force_authenticate(self.user)

    def test_external_book_review_and_dashboard_counts(self):
        response = self.client.post("/api/reviews/", {
            "title": "Example Book", "content": "A thoughtful review.", "rating": 5,
            "date": "2026-08-07", "is_public": True, "item_type": "book",
            "item_id": "/works/OL1W", "external_source": "openlibrary", "metadata": {"author": "Author"},
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Review.objects.get().item_type, "book")
        self.client.post("/api/favorites/", {"item_type": "book", "external_source": "openlibrary", "item_id": "/works/OL1W", "title": "Example Book", "metadata": {}}, format="json")
        stats = self.client.get("/api/dashboard/stats/")
        self.assertEqual(stats.status_code, 200)
        self.assertEqual(stats.data["books_reviewed"], 1)
        self.assertEqual(stats.data["favorites"], 1)

    def test_favorites_are_user_scoped_and_idempotent(self):
        payload = {"item_type": "movie", "external_source": "tmdb", "item_id": "1", "title": "Movie", "metadata": {}}
        self.client.post("/api/favorites/", payload, format="json")
        self.client.post("/api/favorites/", payload, format="json")
        self.assertEqual(CatalogItem.objects.filter(user=self.user, action="favorite").count(), 1)
