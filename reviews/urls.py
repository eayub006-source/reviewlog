from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReviewViewSet,
    RegisterView,
    PublicReviewList,
    ProfileView,
    CatalogSearchView,
    CatalogItemListCreateView,
    CatalogItemDeleteView,
    DashboardStatsView,
    CatalogRecommendationView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

router = DefaultRouter()
router.register(r"reviews", ReviewViewSet)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("public-reviews/", PublicReviewList.as_view(), name="public-reviews"),
    path("catalog/recommendations/<str:item_type>/", CatalogRecommendationView.as_view(), name="catalog-recommendations"),
    path("catalog/books/", CatalogSearchView.as_view(), {"item_type": "books"}, name="book-search"),
    path("catalog/movies/", CatalogSearchView.as_view(), {"item_type": "movies"}, name="movie-search"),
    path("favorites/", CatalogItemListCreateView.as_view(), {"action": "favorite"}, name="favorites"),
    path("favorites/<int:pk>/", CatalogItemDeleteView.as_view(), name="favorite-delete"),
    path("recent-items/", CatalogItemListCreateView.as_view(), {"action": "recent"}, name="recent-items"),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("password-reset/request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("", include(router.urls)),
]
