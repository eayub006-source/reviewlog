from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import CatalogItem, Review
from ..serializers import CatalogItemSerializer
from ..services.catalog_service import search_books, search_movies


class CatalogSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, item_type):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response({"results": [], "page": 1, "has_more": False})
        try:
            page = max(int(request.query_params.get("page", 1)), 1)
        except ValueError:
            page = 1
        return Response(search_books(query, page) if item_type == "books" else search_movies(query, page))


class CatalogItemListCreateView(generics.ListCreateAPIView):
    serializer_class = CatalogItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CatalogItem.objects.filter(user=self.request.user, action=self.kwargs["action"])

    def perform_create(self, serializer):
        item, _ = CatalogItem.objects.update_or_create(
            user=self.request.user, action=self.kwargs["action"], item_type=serializer.validated_data["item_type"],
            external_source=serializer.validated_data["external_source"], item_id=serializer.validated_data["item_id"],
            defaults={key: value for key, value in serializer.validated_data.items() if key != "action"},
        )
        serializer.instance = item


class CatalogItemDeleteView(generics.DestroyAPIView):
    serializer_class = CatalogItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CatalogItem.objects.filter(user=self.request.user, action="favorite")


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.filter(user=request.user)
        return Response({
            "reviews_created": reviews.count(), "books_reviewed": reviews.filter(item_type="book").count(),
            "movies_reviewed": reviews.filter(item_type="movie").count(),
            "favorites": CatalogItem.objects.filter(user=request.user, action="favorite").count(),
            "public_reviews": reviews.filter(is_public=True).count(),
        })
